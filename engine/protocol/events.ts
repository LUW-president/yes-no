import { EventType, ProtocolEvent } from './types';

const VALID_EVENT_TYPES: EventType[] = [
  'question.presented',
  'answer.submitted',
  'session.updated',
  'answer.recorded',
  'artifact.proposed',
  'artifact.accepted',
  'artifact.rejected',
  'session.closed',
];

function hasBaseFields(e: any): boolean {
  return !!(
    e &&
    typeof e.event_id === 'string' &&
    typeof e.event_type === 'string' &&
    typeof e.timestamp === 'string' &&
    typeof e.session_id === 'string' &&
    typeof e.user_id === 'string'
  );
}

export function validateEvent(event: unknown): asserts event is ProtocolEvent {
  const e = event as any;

  if (!hasBaseFields(e)) {
    throw new Error('Invalid event: missing required base fields');
  }

  if (!VALID_EVENT_TYPES.includes(e.event_type)) {
    throw new Error('Invalid event: unsupported event_type');
  }

  switch (e.event_type) {
    case 'question.presented':
      if (!e.question_id || !e.question_text || !e.channel) {
        throw new Error('Invalid question.presented event');
      }
      break;

    case 'answer.submitted':
      if (!e.question_id) throw new Error('Invalid answer.submitted event: missing question_id');
      if (e.answer !== 'yes' && e.answer !== 'no') {
        throw new Error('Invalid answer.submitted event: answer must be yes|no');
      }
      if (!['gesture', 'tap', 'voice'].includes(e.input_mode)) {
        throw new Error('Invalid answer.submitted event: invalid input_mode');
      }
      if (typeof e.latency_ms !== 'number') {
        throw new Error('Invalid answer.submitted event: latency_ms must be number');
      }
      break;

    case 'session.updated':
      if (!['question', 'artifact', 'completed'].includes(e.stage)) {
        throw new Error('Invalid session.updated event: invalid stage');
      }
      if (typeof e.answered_count !== 'number') {
        throw new Error('Invalid session.updated event: answered_count must be number');
      }
      break;

    case 'answer.recorded':
      if (!e.question_id) throw new Error('Invalid answer.recorded event: missing question_id');
      if (e.answer !== 'yes' && e.answer !== 'no') {
        throw new Error('Invalid answer.recorded event: answer must be yes|no');
      }
      if (!['gesture', 'tap', 'voice'].includes(e.input_mode)) {
        throw new Error('Invalid answer.recorded event: invalid input_mode');
      }
      if (typeof e.latency_ms !== 'number') {
        throw new Error('Invalid answer.recorded event: latency_ms must be number');
      }
      break;

    case 'artifact.proposed':
      if (!e.artifact_id || !e.artifact_type || !Array.isArray(e.source_question_ids)) {
        throw new Error('Invalid artifact.proposed event');
      }
      break;

    case 'artifact.accepted':
      if (!e.artifact_id || e.accepted !== true) {
        throw new Error('Invalid artifact.accepted event');
      }
      break;

    case 'artifact.rejected':
      if (!e.artifact_id || e.accepted !== false) {
        throw new Error('Invalid artifact.rejected event');
      }
      break;

    case 'session.closed':
      if (!['completed', 'timeout', 'user_exit', 'system'].includes(e.close_reason)) {
        throw new Error('Invalid session.closed event');
      }
      break;
  }
}

export function createEvent<T extends ProtocolEvent>(event: T): T {
  validateEvent(event);
  return event;
}
