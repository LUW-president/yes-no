import type { YesNo } from '../input/tapInput';

const DEFAULT_BASE_URL = 'http://localhost:3000';

export type BridgeStartResponse = {
  session_id: string;
  question?: string;
};

export type BridgeAnswerResponse = {
  session_id: string;
  next_question?: string;
  artifact_proposed?: string;
  session_complete?: boolean;
};

export type BridgeStateResponse = {
  session_id: string;
  status?: 'active' | 'completed' | string;
  current_question?: string;
  signals?: Record<string, number>;
};

export class NativeBridgeClient {
  constructor(private baseUrl: string = DEFAULT_BASE_URL) {}

  async startSession(user_id: string, pack_id: string): Promise<BridgeStartResponse> {
    const res = await fetch(`${this.baseUrl}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, pack_id }),
    });
    const data = await res.json();
    return { session_id: data.session_id, question: data.question };
  }

  async submitAnswer(session_id: string, answer: YesNo): Promise<BridgeAnswerResponse> {
    const res = await fetch(`${this.baseUrl}/session/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, answer }),
    });
    const data = await res.json();
    return {
      session_id,
      next_question: data.next_question,
      artifact_proposed: data.artifact_proposed,
      session_complete: data.session_complete,
    };
  }

  async getSessionState(session_id: string): Promise<BridgeStateResponse> {
    const res = await fetch(`${this.baseUrl}/session/${encodeURIComponent(session_id)}`);
    const data = await res.json();
    return {
      session_id: data.session_id,
      status: data.status,
      current_question: data.current_question,
      signals: data.signals,
    };
  }
}
