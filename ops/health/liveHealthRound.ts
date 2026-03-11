const BASE = process.env.YESNO_LIVE_URL || 'https://yes-no-kappa.vercel.app';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const root = await fetch(`${BASE}/`);
  const html = await root.text();
  assert(root.ok, `root not ok: ${root.status}`);
  assert(html.includes('YES/NO V1'), 'root missing YES/NO marker');

  const startRes = await fetch(`${BASE}/api/session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 'nurse_health', pack_id: 'creation_v0' }),
  });
  const start = await startRes.json();
  assert(startRes.ok, `start failed: ${JSON.stringify(start)}`);

  let answer: any = null;
  for (let i = 0; i < 8; i += 1) {
    const r = await fetch(`${BASE}/api/session/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: start.session_id, answer: 'yes' }),
    });
    answer = await r.json();
    assert(r.ok, `answer failed: ${JSON.stringify(answer)}`);
    if (!answer.next_question) break;
  }

  const summaryRes = await fetch(`${BASE}/api/session/${encodeURIComponent(start.session_id)}/summary`);
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
