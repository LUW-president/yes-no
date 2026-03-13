import { IncomingMessage, ServerResponse } from 'node:http';
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
<title>YES/NO V1 Prototype</title>
<style>

:root{
  color-scheme:dark;
  --bg:#050607;
  --panel:#0f1215;
  --panel-border:#232933;
  --text:#f2f5f8;
  --muted:#a7b0ba;
  --yes:#33d17a;
  --no:#ff6b6b;
  --accent:#7aa2ff;
}
*{box-sizing:border-box}
body{
  margin:0;
  min-height:100vh;
  background:radial-gradient(circle at top,#141920 0%,var(--bg) 45%);
  color:var(--text);
  font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  display:grid;
  place-items:center;
  padding:24px;
}
.app{width:min(720px,100%);display:grid;gap:14px}
.card{background:linear-gradient(180deg,#151920 0%,var(--panel) 100%);border:1px solid var(--panel-border);border-radius:14px;padding:18px 18px 20px;box-shadow:0 10px 30px #0007}
h1{font-size:1.3rem;margin:0 0 8px}
h2{font-size:1.05rem;margin:0}
p,pre{margin:0}
.meta{display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:.9rem;margin-bottom:10px}
.badge{padding:4px 10px;border-radius:999px;border:1px solid #2f3c52;background:#162035;color:#c5d5ff;font-size:.78rem;font-weight:600}
.status-chip{display:inline-block;padding:5px 10px;border-radius:999px;font-weight:700;font-size:.76rem;border:1px solid #3b4456;margin-right:6px}
.chip-go{background:#123322;border-color:#2f9b69;color:#b7ffd8}
.chip-review{background:#3a2f14;border-color:#d4a53b;color:#ffe8b3}
.chip-no-go{background:#3b1717;border-color:#cc4f4f;color:#ffc8c8}
.kv{display:grid;grid-template-columns:170px 1fr;gap:6px;margin-top:8px;color:#d9e2ec}
.kv .k{color:#9fb0c4}
.actions-secondary{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.topic-help{color:#9fb0c4;font-size:.82rem;margin-top:4px}
.input-error{outline:1px solid #cc4f4f;box-shadow:0 0 0 2px #cc4f4f33}
.summary-meaning{margin:8px 0 10px;color:#dfe7f2;font-size:.92rem}
button.ghost{background:transparent;border-color:#3d4758;color:#c9d7e8}
.question{font-size:1.06rem;line-height:1.5;margin:8px 0 14px;min-height:3.2em}
.actions{display:flex;gap:10px;flex-wrap:wrap}
button{border:1px solid #2c3443;background:#1a202a;color:var(--text);padding:10px 15px;border-radius:11px;font-weight:600;cursor:pointer;transition:transform .08s ease,background .15s ease,border-color .15s ease,opacity .15s}
button:hover:enabled{transform:translateY(-1px);background:#212a36}
button:active:enabled{transform:translateY(0)}
button:disabled{opacity:.45;cursor:not-allowed}
button.primary{border-color:#3e4f6b;background:#202a38}
button.yes{border-color:#2a734d;color:#97f2c0}
button.no{border-color:#7b3232;color:#ffb4b4}
.hint{margin-top:10px;color:var(--muted);font-size:.85rem}
.hint.strong{color:#dce8f8}
.hint.busy{color:#ffd089}
.progress-track{height:8px;background:#12161c;border:1px solid #29313d;border-radius:999px;overflow:hidden;margin:8px 0 12px}
.progress-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),#8ce7ff);transition:width .28s ease}
pre{white-space:pre-wrap;background:#0b0e12;border:1px solid #222b37;border-radius:10px;padding:12px;color:#d9e2ec;line-height:1.45;min-height:130px}
.error{color:#ff8f8f}
.summary-topic{margin:8px 0 6px;color:#dce8f8;line-height:1.4}
.summary-lede{margin:4px 0 8px;color:#dce8f8;line-height:1.45}
.summary-checklist{margin:0 0 10px;padding-left:18px;color:#dfe7f2;line-height:1.5}
.summary-checklist li{margin:2px 0}
.summary-value{font-weight:700}
.black-glass{background:#000 !important;border-color:#111 !important}
#gestureCanvas{width:100%;height:320px;background:#000;border:1px solid #1a1a1a;border-radius:12px;touch-action:none;display:block;margin:10px 0 12px}
.gesture-prompt{font-size:1.05rem;line-height:1.5;margin:8px 0 2px;color:#f5f5f5}
.covenant-line{color:#8d99a6;font-size:.82rem;margin-bottom:8px}
.debug-only{display:none}
</style>
</head>
<body>
<main class="app">
  <section class="card black-glass">
    <div class="meta"><h1>YES/NO V1 Prototype</h1><span class="badge">Prototype • Single Session • Deterministic</span></div>
    <p id="state-strip" class="hint">state: initializing | step: 0</p>
    <div class="progress-track" aria-hidden="true"><div id="progress" class="progress-fill"></div></div>
    <p id="question" class="gesture-prompt">Preparing your decision session...</p>
    <p class="covenant-line">question → gesture → answer → clarity</p>
    <canvas id="gestureCanvas" width="1200" height="640" aria-label="gesture-input-canvas"></canvas>
    <p id="hint" class="hint strong">Draw a gesture on the black glass.</p>
    <div class="actions debug-only" id="debug-controls">
      <button id="start" class="primary">Start Session</button>
      <button id="yes" class="yes" disabled>Yes</button>
      <button id="no" class="no" disabled>No</button>
    </div>
    <label for="decision-topic" class="hint strong debug-only">Decision Topic (optional)</label>
    <input id="decision-topic" class="debug-only" type="text" placeholder="e.g. Should I move to another city?" style="width:100%;margin:6px 0 8px;padding:10px 12px;border-radius:10px;border:1px solid #334; background:#0f141c; color:#e9f0ff;" />
    <p id="topic-help" class="topic-help debug-only">Debug fallback controls (hidden by default).</p>
  </section>
  <section class="card">
    <div class="meta"><h2>Final Summary</h2><span id="status" class="badge">idle</span></div>
    <div id="result-chips"></div>
    <div id="summary" class="kv"><div class="k">state</div><div>Start a session to generate a decision summary.</div></div>
    <div class="actions-secondary">
      <button id="restart" class="ghost">Start New Session</button>
      <button id="demo-alt" class="ghost">Try Alternate Path</button>
      <button id="copy-summary" class="ghost">Copy Summary</button>
    </div>
  </section>
  <section class="card">
    <div class="meta"><h2>Session History (current browser)</h2><span class="badge">local only</span></div>
    <pre id="history">(no completed sessions yet)</pre>
  </section>
</main>
<script>
const startBtn=document.getElementById('start');
const yesBtn=document.getElementById('yes');
const noBtn=document.getElementById('no');
const questionEl=document.getElementById('question');
const summaryEl=document.getElementById('summary');
const resultChipsEl=document.getElementById('result-chips');
const restartBtn=document.getElementById('restart');
const demoAltBtn=document.getElementById('demo-alt');
const copySummaryBtn=document.getElementById('copy-summary');
const historyEl=document.getElementById('history');
const sessionHistory=[];
const statusEl=document.getElementById('status');
const progressEl=document.getElementById('progress');
const hintEl=document.getElementById('hint');
const stateStripEl=document.getElementById('state-strip');
const decisionTopicEl=document.getElementById('decision-topic');
const topicHelpEl=document.getElementById('topic-help');
const gestureCanvas=document.getElementById('gestureCanvas');
const debugControls=document.getElementById('debug-controls');
const debugMode = new URLSearchParams(window.location.search).get('debug') === '1';
if(debugMode){ document.querySelectorAll('.debug-only').forEach((el)=>{ el.style.display = ''; }); }

let sessionId=null;
let questionCount=0;
let decisionTopic='';
const visualQuestionCap=4;

function setBusy(isBusy){
  startBtn.disabled=isBusy;
  if(isBusy){
    startBtn.textContent='Working...';
    statusEl.textContent='loading';
  } else {
    startBtn.textContent='Start Session';
  }
}

function setAnswerButtons(enabled){
  yesBtn.disabled=!enabled;
  noBtn.disabled=!enabled;
  if(enabled){
    yesBtn.textContent='Yes';
    noBtn.textContent='No';
    hintEl.classList.remove('busy');
    return;
  }
  yesBtn.textContent='Yes (waiting)';
  noBtn.textContent='No (waiting)';
}

function updateProgress(){
  const width=Math.min((questionCount/visualQuestionCap)*100,100);
  progressEl.style.width=width+'%';
}



function renderHistory(){
  if(!historyEl) return;
  if(sessionHistory.length===0){ historyEl.textContent='(no completed sessions yet)'; return; }
  historyEl.textContent=sessionHistory.map((h,i)=>
    '#'+(i+1)+' '+h.gate+' | topic '+(h.topic||'-')+' | conf '+Number(h.confidence).toFixed(2)+' | guard '+h.guard+' | reason '+h.reason
  ).join('\\n');
}

function chipClass(gate){
  if(gate==='GO') return 'status-chip chip-go';
  if(gate==='REVIEW') return 'status-chip chip-review';
  return 'status-chip chip-no-go';
}


function summaryTextForClipboard(){
  if(!summaryEl) return '';
  return summaryEl.innerText || summaryEl.textContent || '';
}

function renderSummaryCard(summary, topic){
  if(!summaryEl) return;
  const confidence=Number(summary.final_confidence).toFixed(2);
  const meaning=(summary.gate_result==='GO')
    ? 'Proceed with confidence and keep scope focused.'
    : (summary.gate_result==='REVIEW')
      ? 'Pause and clarify before committing.'
      : 'Hold this decision and reduce uncertainty first.';
  summaryEl.innerHTML=''
    +'<div class="summary-topic">Decision Topic: <span class="summary-value">'+(topic||'Not specified')+'</span></div>'
    +'<div class="summary-lede">Final Decision: <span class="summary-value">'+summary.gate_result+'</span> • Guard: <span class="summary-value">'+summary.guard_status+'</span> • Confidence: <span class="summary-value">'+confidence+'</span></div>'
    +'<ul class="summary-checklist">'
    +'<li><span class="summary-value">What this means:</span> '+meaning+'</li>'
    +'<li><span class="summary-value">Primary reason:</span> '+summary.primary_reason+'</li>'
    +'<li><span class="summary-value">Expected effect:</span> '+summary.expected_effect+'</li>'
    +'</ul>'
    +'<div class="k">gate result</div><div>'+summary.gate_result+'</div>'
    +'<div class="k">guard status</div><div>'+summary.guard_status+'</div>'
    +'<div class="k">confidence</div><div>'+confidence+'</div>';
  if(resultChipsEl){
    resultChipsEl.innerHTML=''
      +'<span class="'+chipClass(summary.gate_result)+'">'+summary.gate_result+'</span>'
      +'<span class="status-chip">'+summary.guard_status+'</span>';
  }
}

function renderError(message){
  questionEl.innerHTML='<span class="error">'+message+'</span>';
  statusEl.textContent='error';
  hintEl.textContent='Try starting a new session.';
  renderStateStrip('error');
}


function renderStateStrip(state){
  if(!stateStripEl) return;
  stateStripEl.textContent='state: '+state+' | step: '+questionCount;
}

async function startSession(){
  decisionTopic=(decisionTopicEl&&decisionTopicEl.value?decisionTopicEl.value.trim():'');
  if(decisionTopicEl) decisionTopicEl.classList.remove('input-error');
  if(topicHelpEl){
    topicHelpEl.textContent = decisionTopic
      ? 'Great. We will keep this topic in your final summary.'
      : 'No topic provided. We will still run one focused session and return a clear summary.';
  }
  if(decisionTopicEl) decisionTopicEl.setAttribute('disabled','true');
  setBusy(true);
  setAnswerButtons(false);
  if(summaryEl) summaryEl.innerHTML='<div class="k">state</div><div>Session in progress. Summary appears when complete.</div>';
  if(resultChipsEl) resultChipsEl.innerHTML='';
  statusEl.textContent='starting';
  renderStateStrip('starting');
  hintEl.textContent='Session started. We are running one focused decision session...';
  hintEl.classList.add('busy');
  questionCount=0;
  updateProgress();

  const response=await fetch('/api/session/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:'web_v1_user',pack_id:'creation_v0'})});
  const out=await response.json();
  if(!response.ok) throw new Error(out.error||('HTTP '+response.status));
  sessionId=out.session_id;
  questionEl.textContent=out.question;
  questionCount=1;
  updateProgress();
  setAnswerButtons(true);
  statusEl.textContent='in progress';
  renderStateStrip('in-progress');
  hintEl.textContent='Question ready. Keep answers binary to finish this session fast (Yes/No).';
  if(topicHelpEl) topicHelpEl.textContent='Session active for: '+decisionTopic;
  hintEl.classList.remove('busy');
  setBusy(false);
}

async function answer(value){
  if(!sessionId) return;
  setAnswerButtons(false);
  statusEl.textContent='processing';
  renderStateStrip('processing');
  hintEl.textContent='Answer received. Checking next step...';
  hintEl.classList.add('busy');

  const response=await fetch('/api/session/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sessionId,answer:value})});
  const out=await response.json();
  if(!response.ok) throw new Error(out.error||('HTTP '+response.status));

  if(out.next_question){
    questionCount+=1;
    updateProgress();
    questionEl.textContent=out.next_question;
    statusEl.textContent='in progress';
    renderStateStrip('in-progress');
    hintEl.textContent='Next question ready. Keep going with Yes / No (or Y / N).';
    hintEl.classList.remove('busy');
    setAnswerButtons(true);
    return;
  }

  questionEl.textContent=out.artifact_proposed?'Artifact proposed. Session complete.':'Session complete.';
  statusEl.textContent='complete';
  renderStateStrip('complete');
  hintEl.textContent='Run another session to compare outcomes.';
  hintEl.classList.remove('busy');
  progressEl.style.width='100%';

  const summaryResponse=await fetch('/api/session/'+encodeURIComponent(sessionId)+'/summary');
  const summary=await summaryResponse.json();
  if(!summaryResponse.ok) throw new Error(summary.error||('HTTP '+summaryResponse.status));
  renderSummaryCard(summary, decisionTopic);
  sessionHistory.unshift({
    gate:summary.gate_result,
    confidence:summary.final_confidence,
    guard:summary.guard_status,
    reason:summary.primary_reason,
    topic: decisionTopic || '-',
  });
  if(sessionHistory.length>6) sessionHistory.length=6;
  renderHistory();
}

startBtn.addEventListener('click',()=>startSession().catch((err)=>{setBusy(false);setAnswerButtons(false); if(decisionTopicEl) decisionTopicEl.removeAttribute('disabled'); renderError('Failed to start session: '+(err&&err.message?err.message:String(err)));}));

// Phase 2 scaffold: auto-start session on load (single-session, gesture-first surface)
startSession().catch((err)=>{ setBusy(false); setAnswerButtons(false); renderError('Failed to start session: '+(err&&err.message?err.message:String(err))); });
yesBtn.addEventListener('click',()=>answer('yes').catch((err)=>renderError('Failed to submit answer: '+(err&&err.message?err.message:String(err)))));
noBtn.addEventListener('click',()=>answer('no').catch((err)=>renderError('Failed to submit answer: '+(err&&err.message?err.message:String(err)))));


restartBtn.addEventListener('click',()=>startSession().catch((err)=>{setBusy(false);setAnswerButtons(false); if(decisionTopicEl) decisionTopicEl.removeAttribute('disabled'); renderError('Failed to start session: '+(err&&err.message?err.message:String(err)));}));

demoAltBtn.addEventListener('click',async ()=>{
  try{
    await startSession();
    await answer('yes');
    await answer('no');
    await answer('yes');
  }catch(err){
    renderError('Failed alternate path: '+(err&&err.message?err.message:String(err)));
  }
});


copySummaryBtn.addEventListener('click', async ()=>{
  try{
    const text = summaryTextForClipboard();
    if(!text || text.includes('(not available yet)')){
      hintEl.textContent='No summary yet. Complete a session first.';
      return;
    }
    if(navigator && navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      hintEl.textContent='Summary copied to clipboard.';
    }else{
      hintEl.textContent='Clipboard unavailable in this browser.';
    }
  }catch{
    hintEl.textContent='Unable to copy summary right now.';
  }
});


// Phase 2 scaffold: trace capture only (no gesture classification/submission yet)
if(gestureCanvas && gestureCanvas.getContext){
  const ctx=gestureCanvas.getContext('2d');
  let drawing=false;
  let points=[];
  const drawPoint=(x,y)=>{ if(!ctx) return; ctx.fillStyle='#f2f5f8'; ctx.fillRect(x,y,2,2); };
  const pos=(ev)=>{
    const r=gestureCanvas.getBoundingClientRect();
    return { x: (ev.clientX-r.left)*(gestureCanvas.width/r.width), y: (ev.clientY-r.top)*(gestureCanvas.height/r.height) };
  };
  const clearCanvas=()=>{ if(!ctx) return; ctx.fillStyle='#000'; ctx.fillRect(0,0,gestureCanvas.width,gestureCanvas.height); };
  clearCanvas();
  const begin=(ev)=>{ drawing=true; points=[]; clearCanvas(); const p=pos(ev); points.push(p); drawPoint(p.x,p.y); if(hintEl) hintEl.textContent='Tracing gesture...'; };
  const move=(ev)=>{ if(!drawing) return; const p=pos(ev); points.push(p); drawPoint(p.x,p.y); };
  const end=()=>{ if(!drawing) return; drawing=false; if(hintEl) hintEl.textContent='Trace captured. Classification is enabled in next phase.'; console.log(JSON.stringify({event:'gesture_trace_captured', points: points.length})); };
  gestureCanvas.addEventListener('pointerdown', begin);
  gestureCanvas.addEventListener('pointermove', move);
  gestureCanvas.addEventListener('pointerup', end);
  gestureCanvas.addEventListener('pointerleave', end);
}

document.addEventListener('keydown',(event)=>{
  if(event.repeat) return;
  const key=event.key.toLowerCase();
  if(!yesBtn.disabled && key==='y'){ void answer('yes').catch((err)=>renderError('Failed to submit answer: '+(err&&err.message?err.message:String(err)))); }
  if(!noBtn.disabled && key==='n'){ void answer('no').catch((err)=>renderError('Failed to submit answer: '+(err&&err.message?err.message:String(err)))); }
});
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
