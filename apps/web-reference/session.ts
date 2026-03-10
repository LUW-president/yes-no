import { WebAdapter } from '../../adapters/web/webAdapter';
import type { YesNo } from './input';

export type WebSessionState = {
  session_id: string;
  question?: string;
  artifact?: string;
  status?: string;
};

export class WebReferenceSession {
  constructor(private adapter = new WebAdapter()) {}

  state: WebSessionState | null = null;

  async start(user_id: string, pack_id: string): Promise<WebSessionState> {
    const started = await this.adapter.startSession(user_id, pack_id);
    this.state = started;
    return started;
  }

  async answer(input: YesNo): Promise<WebSessionState> {
    if (!this.state?.session_id) throw new Error('Session not started');

    const next = await this.adapter.submitAnswer(this.state.session_id, input);
    const updated = await this.adapter.getSessionState(this.state.session_id);

    this.state = {
      session_id: this.state.session_id,
      question: next.question || updated.question,
      artifact: next.artifact,
      status: next.status || updated.status,
    };

    return this.state;
  }
}
