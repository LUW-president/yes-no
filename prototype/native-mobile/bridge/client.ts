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

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {} as any;
  }
}

export class NativeBridgeClient {
  constructor(private baseUrl: string = DEFAULT_BASE_URL) {}

  async startSession(user_id: string, pack_id: string): Promise<BridgeStartResponse> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, pack_id }),
      });
    } catch {
      throw new Error('Bridge error: unable to start session (bridge unreachable)');
    }

    const data = await safeJson(res);
    if (!res.ok || !data?.session_id) {
      throw new Error('Bridge error: failed to start session');
    }

    return { session_id: data.session_id, question: data.question };
  }

  async submitAnswer(session_id: string, answer: YesNo): Promise<BridgeAnswerResponse> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/session/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, answer }),
      });
    } catch {
      throw new Error('Bridge error: failed to submit answer (bridge unreachable)');
    }

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error('Bridge error: failed to submit answer');
    }

    return {
      session_id,
      next_question: data.next_question,
      artifact_proposed: data.artifact_proposed,
      session_complete: data.session_complete,
    };
  }

  async getSessionState(session_id: string): Promise<BridgeStateResponse> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/session/${encodeURIComponent(session_id)}`);
    } catch {
      throw new Error('Bridge error: unable to read session state (bridge unreachable)');
    }

    const data = await safeJson(res);
    if (!res.ok || !data?.session_id) {
      throw new Error('Bridge error: failed to read session state');
    }

    return {
      session_id: data.session_id,
      status: data.status,
      current_question: data.current_question,
      signals: data.signals,
    };
  }
}
