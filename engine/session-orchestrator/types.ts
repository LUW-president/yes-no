export type SessionStatus = 'active' | 'completed';

export type SessionState = {
  session_id: string;
  user_id: string;
  pack_id: string;
  current_question_id: string;
  status: SessionStatus;
  started_at: string;
  last_event_at: string;
};

export type StartSessionResult = {
  session: SessionState;
  question_text: string;
};

export type RecordAnswerResult =
  | { kind: 'question'; session: SessionState; question_text: string }
  | { kind: 'artifact'; session: SessionState; artifact_trigger: string }
  | { kind: 'end'; session: SessionState };
