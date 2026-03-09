import { mapArtifactToSignal, mapQuestionToSignal, clampScore } from './model';
import { MemoryEvent, SignalName, UserProfile } from './types';

const YES_DELTA = 0.1;
const NO_DELTA = -0.05;
const ARTIFACT_ACCEPT_DELTA = 0.1;
const ARTIFACT_REJECT_DELTA = -0.1;

export function createEmptyProfile(user_id: string): UserProfile {
  const now = new Date().toISOString();
  return {
    user_id,
    signals: {
      create_interest: 0,
      art_interest: 0,
      film_interest: 0,
      image_preference: 0,
      idea_exploration: 0,
    },
    last_updated: now,
    event_count: 0,
  };
}

function applyDelta(profile: UserProfile, signal: SignalName | null, delta: number): UserProfile {
  if (!signal) return profile;
  profile.signals[signal] = clampScore(profile.signals[signal] + delta);
  return profile;
}

export function updateProfileFromEvent(profile: UserProfile, event: MemoryEvent): UserProfile {
  profile.event_count += 1;
  profile.last_updated = new Date().toISOString();

  switch (event.event_type) {
    case 'question.presented':
      return profile;

    case 'answer.recorded': {
      const signal = mapQuestionToSignal(event.question_id);
      const delta = event.answer === 'yes' ? YES_DELTA : NO_DELTA;
      return applyDelta(profile, signal, delta);
    }

    case 'artifact.proposed':
      return profile;

    case 'artifact.accepted': {
      const signal = mapArtifactToSignal(event.artifact_id);
      return applyDelta(profile, signal, ARTIFACT_ACCEPT_DELTA);
    }

    case 'artifact.rejected': {
      const signal = mapArtifactToSignal(event.artifact_id);
      return applyDelta(profile, signal, ARTIFACT_REJECT_DELTA);
    }
  }
}

export function getSignal(profile: UserProfile, signal_name: SignalName): number {
  return profile.signals[signal_name];
}
