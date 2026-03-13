const BASE = process.env.YESNO_LIVE_URL || 'https://yes-no-kappa.vercel.app';
const REQUEST_TIMEOUT_MS = Number(process.env.YESNO_LIVE_TIMEOUT_MS || 7000);
const MAX_RETRIES = Number(process.env.YESNO_LIVE_RETRIES || 2);

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

async function fetchWithRetry(path: string, options?: RequestOptions): Promise<Response> {
  const url = `${BASE}${path}`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
      lastError = error;
      if (attempt > MAX_RETRIES) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`request failed after ${attempt} attempts: ${path} (${message})`);
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error(`request failed: ${path} (${String(lastError)})`);
}

async function main() {
  const root = await fetchWithRetry('/');
  const html = await root.text();
  assert(root.ok, `root not ok: ${root.status}`);
  assert(html.includes('YES/NO V1'), 'root missing YES/NO marker');

  const startRes = await fetchWithRetry('/api/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 'nurse_health', pack_id: 'creation_v0' }),
  });
  const start = await startRes.json();
  assert(startRes.ok, `start failed: ${JSON.stringify(start)}`);

  let answer: any = null;
  for (let i = 0; i < 8; i += 1) {
    const r = await fetchWithRetry('/api/session/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: start.session_id, answer: 'yes' }),
    });
    answer = await r.json();
    assert(r.ok, `answer failed: ${JSON.stringify(answer)}`);
    if (!answer.next_question) break;
  }

  const summaryRes = await fetchWithRetry(`/api/session/${encodeURIComponent(start.session_id)}/summary`);
  const summary = await summaryRes.json();
  assert(summaryRes.ok, `summary failed: ${JSON.stringify(summary)}`);
  assert(typeof summary.final_confidence === 'number', 'summary.final_confidence missing');
  assert(['CONTINUE', 'SLOW_DOWN', 'REVIEW'].includes(summary.guard_status), 'invalid guard status');
  assert(['GO', 'REVIEW', 'NO_GO'].includes(summary.gate_result), 'invalid gate result');
  assert(typeof summary.primary_reason === 'string' && summary.primary_reason.length > 0, 'primary reason missing');

  console.log(JSON.stringify({
    status: 'PASS',
    base: BASE,
    session_id: start.session_id,
    gate_result: summary.gate_result,
    guard_status: summary.guard_status,
    final_confidence: summary.final_confidence,
  }, null, 2));
}

main().catch((err) => {
  console.error('[NURSE_ROUND_FAIL]', err?.message || err);
  process.exit(1);
});
