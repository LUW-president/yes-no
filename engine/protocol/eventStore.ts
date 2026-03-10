import { ProtocolEvent, ProtocolStreamEvent } from './types';
import { validateEvent } from './events';

export class InMemoryEventStore {
  private events: ProtocolStreamEvent[] = [];
  private sequence = 0;

  appendEvent(event: ProtocolEvent): ProtocolStreamEvent {
    validateEvent(event);
    this.sequence += 1;
    const streamEvent: ProtocolStreamEvent = {
      ...event,
      sequence: this.sequence,
    };
    this.events.push(streamEvent);
    return streamEvent;
  }

  getAllEvents(): ProtocolStreamEvent[] {
    return [...this.events];
  }

  getSessionEvents(session_id: string): ProtocolStreamEvent[] {
    return this.events.filter((e) => e.session_id === session_id);
  }

  getUserEvents(user_id: string): ProtocolStreamEvent[] {
    return this.events.filter((e) => e.user_id === user_id);
  }
}
