export type StartSessionRequest = {
  user_id: string;
  pack_id: string;
};

export type StartSessionResponse = {
  session_id: string;
  question: string;
};

export type SubmitAnswerRequest = {
  session_id: string;
  answer: 'yes' | 'no';
};

export type SubmitAnswerResponse = {
  next_question?: string;
  artifact_proposed?: string;
  session_complete?: boolean;
};

export type SessionStateResponse = {
  session_id: string;
  status: 'active' | 'completed';
  current_question: string;
  signals: Record<string, number>;
};
