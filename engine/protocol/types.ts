export type EventType =
  | 'question.presented'
  | 'answer.recorded'
  | 'artifact.proposed'
  | 'artifact.accepted'
  | 'artifact.rejected'
  | 'session.closed';

export type BaseEvent = {
  event_id: string;
  event_type: EventType;
  timestamp: string;
  session_id: string;
  user_id: string;
};

export type QuestionPresentedEvent = BaseEvent & {
  event_type: 'question.presented';
  question_id: string;
  question_text: string;
  channel: string;
};

export type AnswerRecordedEvent = BaseEvent & {
  event_type: 'answer.recorded';
  question_id: string;
  answer: 'yes' | 'no';
  input_mode: 'gesture' | 'tap' | 'voice';
  latency_ms: number;
};

export type ArtifactProposedEvent = BaseEvent & {
  event_type: 'artifact.proposed';
  artifact_id: string;
  artifact_type: 'script' | 'image' | 'film' | 'idea' | 'other';
  source_question_ids: string[];
};

export type ArtifactAcceptedEvent = BaseEvent & {
  event_type: 'artifact.accepted';
  artifact_id: string;
  accepted: true;
};

export type ArtifactRejectedEvent = BaseEvent & {
  event_type: 'artifact.rejected';
  artifact_id: string;
  accepted: false;
  rejection_reason_code?: string;
};

export type SessionClosedEvent = BaseEvent & {
  event_type: 'session.closed';
  close_reason: 'completed' | 'timeout' | 'user_exit' | 'system';
  summary_ref?: string;
};

export type ProtocolEvent =
  | QuestionPresentedEvent
  | AnswerRecordedEvent
  | ArtifactProposedEvent
  | ArtifactAcceptedEvent
  | ArtifactRejectedEvent
  | SessionClosedEvent;
