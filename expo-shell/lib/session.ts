import { BridgeApi, type SessionSummaryResponse, type YesNo } from './api';

export type ShellState =
  | { mode: 'launch' }
  | { mode: 'question'; session_id: string; question: string; live_summary: SessionSummaryResponse | null }
  | { mode: 'artifact'; session_id: string; artifact: string; live_summary: SessionSummaryResponse | null }
  | { mode: 'completion'; session_id: string; summary: SessionSummaryResponse | null };

export function initialState(): ShellState {
  return { mode: 'launch' };
}

export async function bootstrapSession(api: BridgeApi, user_id = 'expo_user', pack_id = 'creation_v0'): Promise<ShellState> {
  const started = await api.startSession(user_id, pack_id);
  const live_summary = await api.getSummary(started.session_id).catch(() => null);
  return {
    mode: 'question',
    session_id: started.session_id,
    question: started.question || '',
    live_summary,
  };
}

export async function applyAnswer(api: BridgeApi, state: ShellState, answer: YesNo): Promise<ShellState> {
  if (state.mode !== 'question' && state.mode !== 'artifact') {
    throw new Error('Cannot answer outside active session state');
  }

  const res = await api.submitAnswer(state.session_id, answer);
  const live_summary = await api.getSummary(state.session_id).catch(() => null);

  if (res.artifact_proposed) {
    return { mode: 'artifact', session_id: state.session_id, artifact: res.artifact_proposed, live_summary };
  }

  if (res.session_complete) {
    return { mode: 'completion', session_id: state.session_id, summary: live_summary };
  }

  if (res.next_question) {
    return { mode: 'question', session_id: state.session_id, question: res.next_question, live_summary };
  }

  return { mode: 'completion', session_id: state.session_id, summary: live_summary };
}
