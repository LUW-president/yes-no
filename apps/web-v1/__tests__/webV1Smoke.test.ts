import { request } from 'node:http';
import { __resetForTests } from '../../../engine/session-orchestrator/orchestrator';
import { startWebV1Server } from '../server';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function httpJson(port: number, method: string, path: string, body?: unknown): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const req = request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload),
            }
          : undefined,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
          } catch (err) {
            reject(err);
          }
        });
      },
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}


function httpText(port: number, method: string, path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path, method }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  __resetForTests();

  const server = startWebV1Server(0);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Failed to bind test server');
  const port = address.port;

  try {
    const html = await httpText(port, 'GET', '/');
    assert(html.includes('Prototype • Single Session • Deterministic'), 'badge exists in source (debug-only in normal mode)');
    assert(html.includes('Is there something you want right now?') || html.includes('Preparing your decision session...'), 'question copy should be present in source');
    assert(html.includes('Gesture controls'), 'gesture controls header should be visible');
    assert(html.includes('O = YES'), 'yes instruction should be visible');
    assert(html.includes('X / \\ / | / I = NO'), 'no instruction aliases should be visible');
    assert(html.includes('id="gestureCanvas"'), 'gesture canvas id should be gestureCanvas');
    assert(html.includes('gestureCanvas'), 'gesture canvas should be present');
    assert(html.includes('Do you understand the MVP? YES or NO'), 'tutorial prompt should be present');
    assert(html.includes('Unknown gesture = retry (no penalty)'), 'tutorial retry rule should be present');
    assert(html.includes('Candidate: —'), 'candidate line should be present');
    assert(html.includes('Decision Topic (optional)'), 'debug fallback topic control should still exist in source');

    const start = await httpJson(port, 'POST', '/api/session/start', {
      user_id: 'smoke_user',
      pack_id: 'creation_v0',
    });

    assert(typeof start.session_id === 'string', 'session_id should be string');
    assert(typeof start.question === 'string' && start.question.length > 0, 'question should be non-empty');

    const a1 = await httpJson(port, 'POST', '/api/session/answer', { session_id: start.session_id, answer: 'yes' });
    assert(!!a1.next_question || !!a1.artifact_proposed || !!a1.session_complete, 'answer response missing expected fields');

    const a2 = await httpJson(port, 'POST', '/api/session/answer', { session_id: start.session_id, answer: 'yes' });
    if (a2.next_question) {
      await httpJson(port, 'POST', '/api/session/answer', { session_id: start.session_id, answer: 'yes' });
    }

    const summary = await httpJson(port, 'GET', `/api/session/${encodeURIComponent(start.session_id)}/summary`);
    assert(typeof summary.final_confidence === 'number', 'final_confidence should be numeric');
    assert(['CONTINUE', 'SLOW_DOWN', 'REVIEW'].includes(summary.guard_status), 'guard_status invalid');
    assert(['GO', 'REVIEW', 'NO_GO'].includes(summary.gate_result), 'gate_result invalid');
    assert(typeof summary.primary_reason === 'string' && summary.primary_reason.length > 0, 'primary_reason missing');
    assert(['stabilize', 'clarify', 'confirm'].includes(summary.expected_effect), 'expected_effect invalid');

    console.log('web v1 smoke test passed');
  } finally {
    await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

void run();
