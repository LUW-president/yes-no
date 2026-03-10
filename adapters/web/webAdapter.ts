const DEFAULT_BASE_URL = 'http://localhost:3000';

export type NormalizedSessionState = {
  session_id: string;
  question?: string;
  artifact?: string;
  status?: string;
};

function normalize(payload: any): NormalizedSessionState {
  return {
    session_id: payload.session_id || '',
    question: payload.question || payload.next_question,
    artifact: payload.artifact_proposed,
    status: payload.status || (payload.session_complete ? 'completed' : 'active'),
  };
}

export class WebAdapter {
  constructor(private baseUrl: string = DEFAULT_BASE_URL) {}

  async startSession(user_id: string, pack_id: string) {
    const res = await fetch(`${this.baseUrl}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, pack_id }),
    });
    const data = await res.json();
    return normalize(data);
  }

  async submitAnswer(session_id: string, answer: 'yes' | 'no') {
    const res = await fetch(`${this.baseUrl}/session/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, answer }),
    });
    const data = await res.json();
    return normalize({ session_id, ...data });
  }

  async getSessionState(session_id: string) {
    const res = await fetch(`${this.baseUrl}/session/${encodeURIComponent(session_id)}`);
    const data = await res.json();
    return normalize({ ...data, question: data.current_question });
  }
}
