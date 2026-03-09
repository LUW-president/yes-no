import { ProtocolEvent } from './types';
import { validateEvent } from './events';

export class InMemoryEventStore {
  private events: ProtocolEvent[] = [];

  appendEvent(event: ProtocolEvent): void {
    validateEvent(event);
    this.events.push(event);
  }

  getSessionEvents(session_id: string): ProtocolEvent[] {
    return this.events.filter((e) => e.session_id === session_id);
  }

  getUserEvents(user_id: string): ProtocolEvent[] {
    return this.events.filter((e) => e.user_id === user_id);
  }
}
