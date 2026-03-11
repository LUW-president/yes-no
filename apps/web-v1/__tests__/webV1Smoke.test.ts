import { createServer } from 'node:http';
import { handleWebV1 } from '../handler';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const server = createServer((req, res) => handleWebV1(req, res));
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const addr = server.address();
  if (!addr || typeof addr === 'string') throw new Error('failed to bind test server');
  const base = `http://127.0.0.1:${addr.port}`;

  const start = await fetch(`${base}/api/session/start`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ user_id: 'smoke_user', pack_id: 'creation_v0' }),
  }).then((r) => r.json());
  assert(!!start.session_id, 'missing session_id');

  await fetch(`${base}/api/session/answer`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ session_id: start.session_id, answer: 'yes' }) });
  await fetch(`${base}/api/session/answer`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ session_id: start.session_id, answer: 'yes' }) });
  await fetch(`${base}/api/session/answer`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ session_id: start.session_id, answer: 'yes' }) });

  const summary = await fetch(`${base}/api/session/${encodeURIComponent(start.session_id)}/summary`).then((r) => r.json());
  assert(typeof summary.final_confidence === 'number', 'missing confidence');
  assert(['GO', 'REVIEW', 'NO_GO'].includes(summary.gate_result), 'invalid gate_result');
  assert(['CONTINUE', 'SLOW_DOWN', 'REVIEW'].includes(summary.guard_status), 'invalid guard_status');

  const html = await fetch(`${base}/`).then((r) => r.text());
  assert(html.includes('YES/NO V1 (Prototype)'), 'html shell missing');

  server.close();
  console.log('web v1 smoke tests passed');
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
