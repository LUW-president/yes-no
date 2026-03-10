import { createServer } from 'node:http';
import { once } from 'node:events';
import { __resetForTests } from '../../../engine/session-orchestrator/orchestrator';
import { handleRequest } from '../routes';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function jsonFetch(url: string, init?: RequestInit) {
  const r = await fetch(url, init);
  return { status: r.status, body: await r.json() };
}

__resetForTests();
const server = createServer((req, res) => handleRequest(req, res));
server.listen(0);
await once(server, 'listening');
const addr = server.address();
if (!addr || typeof addr === 'string') throw new Error('No addr');
const base = `http://127.0.0.1:${addr.port}`;

// session start endpoint
const startRes = await jsonFetch(`${base}/session/start`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: 'u_bridge', pack_id: 'creation_v0' }),
});
assert(startRes.status === 200, 'start endpoint failed');
assert(!!startRes.body.session_id, 'missing session_id');
assert(!!startRes.body.question, 'missing question');
const sid = startRes.body.session_id;

// answer submission flow
const ans1 = await jsonFetch(`${base}/session/answer`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ session_id: sid, answer: 'yes' }),
});
assert(ans1.status === 200, 'answer endpoint failed');
assert(!!ans1.body.next_question || !!ans1.body.artifact_proposed || !!ans1.body.session_complete, 'invalid answer response');

// session completion path (drive to completion quickly)
let cursor = ans1.body;
for (let i = 0; i < 4; i++) {
  if (cursor.session_complete) break;
  const next = await jsonFetch(`${base}/session/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sid, answer: 'no' }),
  });
  cursor = next.body;
}

// state retrieval
const stateRes = await jsonFetch(`${base}/session/${encodeURIComponent(sid)}`);
assert(stateRes.status === 200, 'state endpoint failed');
assert(stateRes.body.session_id === sid, 'state sid mismatch');
assert(!!stateRes.body.status, 'missing status');
assert(!!stateRes.body.current_question, 'missing current_question');
assert(!!stateRes.body.signals, 'missing signals');

server.close();
console.log('reference bridge tests passed');
