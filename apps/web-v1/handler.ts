import { IncomingMessage, ServerResponse } from 'node:http';
import { gestureClassifierClientJs } from './gestureClassifier.ts';
import { gestureCanvasClientJs } from './gestureCanvas.ts';
import {
  getSessionSummaryController,
  startSessionController,
  submitAnswerController,
} from '../../bridge/reference-app/sessionController.js';

const pageHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Black Glass Gesture Oracle v0</title>
<style>
:root{color-scheme:dark;--bg:#000;--panel:#070809;--border:#181a1d;--text:#f4f6f8;--muted:#9aa4af;--accent:#85c3ff;--yes:#2cd67e;--no:#ff6b6b}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;display:grid;place-items:center;padding:20px}
main{width:min(760px,100%);display:grid;gap:14px}
.card{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:16px}
h1{margin:0;font-size:1.1rem}
p{margin:0}
.meta{display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:.86rem;margin-bottom:10px}
#question{font-size:1.08rem;line-height:1.45;min-height:3em;margin:8px 0}
.covenant{color:var(--muted);font-size:.83rem;margin-bottom:10px}
#gestureCanvas{width:100%;height:360px;background:#000;border:1px solid #1a1a1a;border-radius:12px;touch-action:none;display:block}
#hint{margin-top:10px;color:var(--accent);font-size:.9rem}
#summary{display:grid;grid-template-columns:145px 1fr;gap:7px;color:#dbe6f5}
#summary .k{color:#9fb0c4}
.badge{padding:4px 9px;border-radius:999px;border:1px solid #2c3240;background:#0d1320;color:#cbd9f2;font-size:.75rem}
.debug-only{display:none}
.actions{display:flex;gap:8px;margin-top:10px}
button,input{background:#0d1118;border:1px solid #2b3342;border-radius:10px;color:#dbe6f5;padding:9px 10px}
button{cursor:pointer}
</style>
</head>
<body>
<main>
  <section class="card">
    <div class="meta"><h1>YES/NO Gesture Oracle</h1><span class="badge">Prototype • Single Session</span></div>
    <p id="state">state: initializing</p>
    <p id="question">Preparing your first question...</p>
    <p class="covenant">question → gesture → answer → clarity</p>
    <canvas id="gestureCanvas" width="1200" height="680" aria-label="gesture-input-canvas"></canvas>
    <p id="hint">Draw a circle for YES or a cross for NO.</p>

    <div class="debug-only" id="debug-controls">
      <div class="actions">
        <button id="yes" type="button">Debug YES</button>
        <button id="no" type="button">Debug NO</button>
      </div>
      <input id="decision-topic" type="text" placeholder="optional topic" />
    </div>
  </section>

  <section class="card">
    <div class="meta"><strong>Final Summary</strong><span id="status" class="badge">pending</span></div>
    <div id="summary"><div class="k">state</div><div>Complete the session to see gate, confidence, and reason.</div></div>
  </section>
</main>

<script>
${gestureClassifierClientJs}
${gestureCanvasClientJs}
const questionEl=document.getElementById('question');
const summaryEl=document.getElementById('summary');
const hintEl=document.getElementById('hint');
const statusEl=document.getElementById('status');
const stateEl=document.getElementById('state');
const gestureCanvas=document.getElementById('gestureCanvas');
const yesBtn=document.getElementById('yes');
const noBtn=document.getElementById('no');

const debugMode = new URLSearchParams(window.location.search).get('debug') === '1';
if(debugMode){ document.querySelectorAll('.debug-only').forEach((el)=>{ el.style.display = ''; }); }

let sessionId=null;
let completed=false;
let currentQuestion='';

function track(event, data){
  console.log(JSON.stringify({ event, ...(data||{}) }));
}

function setState(v){ if(stateEl) stateEl.textContent='state: '+v; }

function renderError(message){
  questionEl.innerHTML='<span style="color:#ff9a9a">'+message+'</span>';
  setState('error');
  statusEl.textContent='error';
}

function renderSummary(summary){
  const confidence=Number(summary.final_confidence).toFixed(2);
  summaryEl.innerHTML=''
    +'<div class="k">gate</div><div>'+summary.gate_result+'</div>'
    +'<div class="k">confidence</div><div>'+confidence+'</div>'
    +'<div class="k">reason</div><div>'+summary.primary_reason+'</div>'
    +'<div class="k">guard</div><div>'+summary.guard_status+'</div>';
}

async function startSession(){
  setState('starting');
  statusEl.textContent='starting';
  const response=await fetch('/api/session/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:'web_v1_user',pack_id:'creation_v0'})});
  const out=await response.json();
  if(!response.ok) throw new Error(out.error||('HTTP '+response.status));
  sessionId=out.session_id;
  currentQuestion=out.question;
  questionEl.textContent=currentQuestion;
  setState('question');
  statusEl.textContent='in_progress';
  hintEl.textContent='Draw once and pause. Circle = YES. Cross = NO.';
}

async function submitAnswer(value){
  if(!sessionId || completed) return;
  setState('submitting');
  track('gesture_submitted', { normalized_answer: value });
  const response=await fetch('/api/session/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sessionId,answer:value})});
  const out=await response.json();
  if(!response.ok) throw new Error(out.error||('HTTP '+response.status));

  if(out.next_question){
    currentQuestion=out.next_question;
    questionEl.textContent=currentQuestion;
    setState('question');
    statusEl.textContent='in_progress';
    hintEl.textContent='Next question ready. Circle = YES, Cross = NO.';
    return;
  }

  const summaryResponse=await fetch('/api/session/'+encodeURIComponent(sessionId)+'/summary');
  const summary=await summaryResponse.json();
  if(!summaryResponse.ok) throw new Error(summary.error||('HTTP '+summaryResponse.status));
  completed=true;
  questionEl.textContent='Session complete.';
  renderSummary(summary);
  setState('complete');
  statusEl.textContent='complete';
  hintEl.textContent='Clarity delivered. This prototype is single-session only.';
}

if(gestureCanvas && window.__gestureClassifier && window.__mountGestureCanvas){
  window.__mountGestureCanvas({
    canvas: gestureCanvas,
    hintEl,
    classifyGesture: window.__gestureClassifier.classifyGesture,
    onSubmit: async (normalized)=>{
      if (normalized === 'yes' || normalized === 'no') await submitAnswer(normalized);
    },
    onUnknown: ()=>{
      track('gesture_unknown_retry', { reason: 'unrecognized_gesture' });
      hintEl.textContent='Unknown gesture. Retry with a clear circle or cross.';
      setState('retry');
    },
    onDetected: (result)=>{
      if(result==='yes') track('gesture_detected_yes');
      else if(result==='no') track('gesture_detected_no');
    },
  });
}

yesBtn&&yesBtn.addEventListener('click',()=>submitAnswer('yes').catch((err)=>renderError('Submit failed: '+(err&&err.message?err.message:String(err)))));
noBtn&&noBtn.addEventListener('click',()=>submitAnswer('no').catch((err)=>renderError('Submit failed: '+(err&&err.message?err.message:String(err)))));

startSession().catch((err)=>renderError('Failed to start session: '+(err&&err.message?err.message:String(err))));
</script>
</body>
</html>`;

function runtimeLog(event: string, data: Record<string, unknown>) {
  const payload = {
    ts: new Date().toISOString(),
    event,
    ...data,
  };
  try {
    console.log(JSON.stringify(payload));
  } catch {
    // no-op: logging must never break request flow
  }
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function sendHtml(res: ServerResponse, html: string) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

async function readJsonBody(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8') || '{}';
  return JSON.parse(raw);
}

export async function handleWebV1Request(req: IncomingMessage, res: ServerResponse) {
  try {
    const method = req.method || 'GET';
    const url = req.url || '/';

    if (method === 'GET' && (url === '/' || url.startsWith('/?'))) {
      return sendHtml(res, pageHtml);
    }

    if (method === 'POST' && url === '/api/session/start') {
      const body = await readJsonBody(req);
      const out = startSessionController(body);
      runtimeLog('session_start', {
        user_id: body?.user_id ?? 'unknown',
        pack_id: body?.pack_id ?? 'unknown',
        session_id: out?.session_id ?? 'unknown',
      });
      return sendJson(res, 200, out);
    }

    if (method === 'POST' && url === '/api/session/answer') {
      const body = await readJsonBody(req);
      const out = submitAnswerController(body);
      if (out?.session_complete === true || out?.completed === true || out?.done === true) {
        runtimeLog('session_complete', {
          session_id: body?.session_id ?? 'unknown',
          completion: true,
        });
      }
      return sendJson(res, 200, out);
    }

    if (method === 'GET' && url.startsWith('/api/session/') && url.endsWith('/summary')) {
      const session_id = decodeURIComponent(url.replace('/api/session/', '').replace('/summary', ''));
      const out = getSessionSummaryController(session_id);
      runtimeLog('session_summary', {
        session_id,
        gate_result: out?.gate_result ?? 'unknown',
        guard_status: out?.guard_status ?? 'unknown',
        final_confidence: typeof out?.final_confidence === 'number' ? out.final_confidence : null,
      });
      return sendJson(res, 200, out);
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (err: any) {
    return sendJson(res, 400, { error: err?.message || 'Bad request' });
  }
}
