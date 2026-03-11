import { BridgeApi, type SessionSummaryResponse, type YesNo } from './api';

export type ShellState =
  | { mode: 'launch' }
  | { mode: 'question'; session_id: string; question: string }
  | { mode: 'artifact'; session_id: string; artifact: string }
  | { mode: 'completion'; session_id: string; summary: SessionSummaryResponse | null };

export function initialState(): ShellState {
  return { mode: 'launch' };
}

export async function bootstrapSession(api: BridgeApi, user_id = 'expo_user', pack_id = 'creation_v0'): Promise<ShellState> {
  const started = await api.startSession(user_id, pack_id);
  return {
    mode: 'question',
    session_id: started.session_id,
    question: started.question || '',
  };
}

export async function applyAnswer(api: BridgeApi, state: ShellState, answer: YesNo): Promise<ShellState> {
  if (state.mode !== 'question' && state.mode !== 'artifact') {
    throw new Error('Cannot answer outside active session state');
  }

  const res = await api.submitAnswer(state.session_id, answer);

  if (res.artifact_proposed) {
    return { mode: 'artifact', session_id: state.session_id, artifact: res.artifact_proposed };
  }

  if (res.session_complete) {
    const summary = await api.getSummary(state.session_id);
    return { mode: 'completion', session_id: state.session_id, summary };
  }

  if (res.next_question) {
    return { mode: 'question', session_id: state.session_id, question: res.next_question };
  }

  const summary = await api.getSummary(state.session_id);
  return { mode: 'completion', session_id: state.session_id, summary };
}
