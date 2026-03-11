import {
  buildSessionDecisionSummary,
  getSessionState,
  recordAnswer,
  startSession,
  __getProfile,
} from '../../engine/session-orchestrator/index.js';
import {
  StartSessionRequest,
  StartSessionResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  SessionStateResponse,
  SessionSummaryResponse,
} from './types.js';

const sessionToUser = new Map<string, string>();

export function startSessionController(body: StartSessionRequest): StartSessionResponse {
  if (!body?.user_id || !body?.pack_id) {
    throw new Error('Invalid request: user_id and pack_id are required');
  }

  const started = startSession(body.user_id, body.pack_id);
  sessionToUser.set(started.session.session_id, body.user_id);

  return {
    session_id: started.session.session_id,
    question: started.question_text,
  };
}

export function submitAnswerController(body: SubmitAnswerRequest): SubmitAnswerResponse {
  if (!body?.session_id || (body?.answer !== 'yes' && body?.answer !== 'no')) {
    throw new Error('Invalid request: session_id and answer(yes|no) are required');
  }

  const session = getSessionState(body.session_id);
  const result = recordAnswer(session, body.answer);

  if (result.kind === 'question') {
    return { next_question: result.question_text };
  }

  if (result.kind === 'artifact') {
    return { artifact_proposed: result.artifact_trigger };
  }

  return { session_complete: true };
}

export function getSessionStateController(session_id: string): SessionStateResponse {
  if (!session_id) throw new Error('Invalid request: session_id required');

  const s = getSessionState(session_id);
  const userId = sessionToUser.get(session_id) || s.user_id;
  const p = __getProfile(userId);

  return {
    session_id: s.session_id,
    status: s.status,
    current_question: s.current_question_id,
    signals: p.signals,
  };
}

export function getSessionSummaryController(session_id: string): SessionSummaryResponse {
  if (!session_id) throw new Error('Invalid request: session_id required');
  const summary = buildSessionDecisionSummary(session_id);
  return {
    session_id: summary.session_id,
    final_confidence: summary.final_confidence,
    guard_status: summary.guard.final_status,
    gate_result: summary.gate.result,
    primary_reason: summary.gate.primary_reason,
    expected_effect: summary.improve.expected_effect,
  };
}
