import { WebAdapter } from '../webAdapter';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const calls: Array<{url:string; method:string}> = [];
(globalThis as any).fetch = async (url: string, init?: any) => {
  calls.push({ url, method: init?.method || 'GET' });

  if (url.endsWith('/session/start')) {
    return { json: async () => ({ session_id: 'w1', question: 'Q1' }) } as any;
  }
  if (url.endsWith('/session/answer')) {
    return { json: async () => ({ artifact_proposed: 'artifact_film' }) } as any;
  }
  if (url.includes('/session/w1')) {
    return { json: async () => ({ session_id: 'w1', status: 'completed', current_question: 'end' }) } as any;
  }
  return { json: async () => ({}) } as any;
};

const a = new WebAdapter('http://localhost:3000');
const started = await a.startSession('u1', 'creation_v0');
assert(started.session_id === 'w1' && started.question === 'Q1', 'start normalization failed');

const art = await a.submitAnswer('w1', 'yes');
assert(art.session_id === 'w1' && art.artifact === 'artifact_film', 'artifact normalization failed');

const state = await a.getSessionState('w1');
assert(state.session_id === 'w1' && state.status === 'completed', 'state normalization failed');

assert(calls[0].url.endsWith('/session/start') && calls[0].method === 'POST', 'start endpoint call failed');
assert(calls[1].url.endsWith('/session/answer') && calls[1].method === 'POST', 'answer endpoint call failed');
assert(calls[2].url.endsWith('/session/w1') && calls[2].method === 'GET', 'state endpoint call failed');

console.log('web adapter tests passed');
