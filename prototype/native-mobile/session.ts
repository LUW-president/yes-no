import { NativeBridgeClient } from './bridge/client';
import type { YesNo } from './input/tapInput';

export type PrototypeState =
  | { mode: 'question'; session_id: string; question: string }
  | { mode: 'artifact'; session_id: string; artifact: string }
  | { mode: 'completion'; session_id: string };

export class NativeMobileSession {
  private client: NativeBridgeClient;
  state: PrototypeState | null = null;

  constructor(client = new NativeBridgeClient()) {
    this.client = client;
  }

  async start(user_id = 'native_mobile_user', pack_id = 'creation_v0'): Promise<PrototypeState> {
    const started = await this.client.startSession(user_id, pack_id);
    this.state = {
      mode: 'question',
      session_id: started.session_id,
      question: started.question || '',
    };
    return this.state;
  }

  async answer(answer: YesNo): Promise<PrototypeState> {
    if (!this.state) throw new Error('Session not started');

    const session_id = this.state.session_id;
    const res = await this.client.submitAnswer(session_id, answer);

    if (res.artifact_proposed) {
      this.state = { mode: 'artifact', session_id, artifact: res.artifact_proposed };
      return this.state;
    }

    if (res.session_complete) {
      this.state = { mode: 'completion', session_id };
      return this.state;
    }

    if (res.next_question) {
      this.state = { mode: 'question', session_id, question: res.next_question };
      return this.state;
    }

    const snap = await this.client.getSessionState(session_id);
    if (snap.status === 'completed') {
      this.state = { mode: 'completion', session_id };
      return this.state;
    }

    if (snap.current_question) {
      this.state = { mode: 'question', session_id, question: snap.current_question };
      return this.state;
    }

    this.state = { mode: 'completion', session_id };
    return this.state;
  }
}
