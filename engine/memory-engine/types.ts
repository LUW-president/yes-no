import { ProtocolEvent } from '../protocol/index.js';

export type SignalName =
  | 'create_interest'
  | 'art_interest'
  | 'film_interest'
  | 'image_preference'
  | 'idea_exploration';

export type UserProfile = {
  user_id: string;
  signals: Record<SignalName, number>;
  last_updated: string;
  event_count: number;
};

export type UpdatableEventType =
  | 'question.presented'
  | 'answer.recorded'
  | 'artifact.proposed'
  | 'artifact.accepted'
  | 'artifact.rejected';

export type MemoryEvent = ProtocolEvent & { event_type: UpdatableEventType };
