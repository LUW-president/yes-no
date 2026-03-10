export type YesNo = 'yes' | 'no';

export type StartSessionResponse = {
  session_id: string;
  question?: string;
};

export type SubmitAnswerResponse = {
  next_question?: string;
  artifact_proposed?: string;
  session_complete?: boolean;
};

export class BridgeApi {
  constructor(private baseUrl: string = 'http://localhost:3000') {}

  async startSession(user_id: string, pack_id: string): Promise<StartSessionResponse> {
    const res = await fetch(`${this.baseUrl}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, pack_id }),
    });
    const data = await res.json();
    if (!res.ok || !data?.session_id) throw new Error('Failed to start session');
    return { session_id: data.session_id, question: data.question };
  }

  async submitAnswer(session_id: string, answer: YesNo): Promise<SubmitAnswerResponse> {
    const res = await fetch(`${this.baseUrl}/session/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, answer }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to submit answer');
    return {
      next_question: data.next_question,
      artifact_proposed: data.artifact_proposed,
      session_complete: data.session_complete,
    };
  }
}
