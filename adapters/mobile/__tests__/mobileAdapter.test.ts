import { MobileAdapter } from '../mobileAdapter';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const calls: Array<{url:string; method:string}> = [];
(globalThis as any).fetch = async (url: string, init?: any) => {
  calls.push({ url, method: init?.method || 'GET' });

  if (url.endsWith('/session/start')) {
    return { json: async () => ({ session_id: 's1', question: 'Q1' }) } as any;
  }
  if (url.endsWith('/session/answer')) {
    return { json: async () => ({ next_question: 'Q2' }) } as any;
  }
  if (url.includes('/session/s1')) {
    return { json: async () => ({ session_id: 's1', status: 'active', current_question: 'Q2' }) } as any;
  }
  return { json: async () => ({}) } as any;
};

const a = new MobileAdapter('http://localhost:3000');
const started = await a.startSession('u1', 'creation_v0');
assert(started.session_id === 's1' && started.question === 'Q1', 'start normalization failed');

const next = await a.submitAnswer('s1', 'yes');
assert(next.session_id === 's1' && next.question === 'Q2', 'answer normalization failed');

const state = await a.getSessionState('s1');
assert(state.session_id === 's1' && state.question === 'Q2' && state.status === 'active', 'state normalization failed');

assert(calls[0].url.endsWith('/session/start') && calls[0].method === 'POST', 'start endpoint call failed');
assert(calls[1].url.endsWith('/session/answer') && calls[1].method === 'POST', 'answer endpoint call failed');
assert(calls[2].url.endsWith('/session/s1') && calls[2].method === 'GET', 'state endpoint call failed');

console.log('mobile adapter tests passed');
