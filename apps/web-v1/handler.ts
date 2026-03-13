import { IncomingMessage, ServerResponse } from 'node:http';
import { gestureClassifierClientJs } from './gestureClassifier.js';
import { gestureCanvasClientJs } from './gestureCanvas.js';
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
  --yes:#3be987;
  --no:#ff7676;
  --accent:#7aa2ff;
}
*{box-sizing:border-box}
body{
  margin:0;
  min-height:100vh;
  background:radial-gradient(circle at top,#25190f 0%,#0b0908 38%,var(--bg) 72%);
  color:var(--text);
  font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  display:grid;
  place-items:center;
  padding:24px;
}
.app{width:min(720px,100%);display:grid;gap:14px}
.card{background:linear-gradient(180deg,#141211 0%,#0f1114 100%);border:1px solid #2f2a27;border-radius:16px;padding:18px 18px 20px;box-shadow:0 12px 34px #0009, 0 0 0 1px #2a221d inset}
h1{font-size:1.3rem;margin:0 0 8px}
h2{font-size:1.05rem;margin:0}
p,pre{margin:0}
.meta{display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:.9rem;margin-bottom:10px}
.badge{padding:4px 10px;border-radius:999px;border:1px solid #5a4a32;background:#2a2118;color:#ffe2bf;font-size:.78rem;font-weight:600}
.status-chip{display:inline-block;padding:5px 10px;border-radius:999px;font-weight:700;font-size:.76rem;border:1px solid #3b4456;margin-right:6px}
.chip-go{background:#144129;border-color:#38b377;color:#c8ffe2}
.chip-review{background:#3a2f14;border-color:#d4a53b;color:#ffe8b3}
.chip-no-go{background:#4a1b1b;border-color:#e35f5f;color:#ffd9d9}
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
button.yes{border-color:#36a96f;color:#b9ffd9;background:#0f2119}
button.no{border-color:#b34848;color:#ffd0d0;background:#251313}
.hint{margin-top:10px;color:var(--muted);font-size:.85rem}
.hint.strong{color:#f2d8bc}
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
#gestureCanvas{width:100%;height:320px;background:#020202;border:1px solid #3a2f25;border-radius:14px;touch-action:none;display:block;margin:12px 0 14px;box-shadow:0 0 0 1px #2a2018 inset, 0 0 24px #8a5a2a22}
.gesture-prompt{font-size:1.22rem;line-height:1.45;margin:12px 0 6px;color:#fff7ef;font-weight:560;letter-spacing:.2px}
.covenant-line{color:#b79a7a;font-size:.8rem;margin-bottom:10px;opacity:.85}
.debug-only{display:none}
.instr-yes{color:var(--yes);font-weight:700}
.instr-no{color:var(--no);font-weight:700}
.candidate-line{font-size:.84rem;color:#b8c0ca;margin:4px 0 8px;min-height:1.2em}
.tutorial-card{margin:10px 0 12px;padding:10px 12px;border:1px solid #3a2f25;border-radius:12px;background:#120f0d;color:#efd8bf;font-size:.86rem;line-height:1.45}
.tutorial-card h3{margin:0 0 6px;font-size:.9rem;color:#ffd9ab}
.tutorial-card .tiny{opacity:.85;font-size:.82rem}
.tutorial-dismiss{margin-top:8px;background:#241b14;border:1px solid #5f4832;color:#ffd9ab;border-radius:8px;padding:5px 9px;cursor:pointer}
.candidate-yes{color:var(--yes);font-weight:700}
.candidate-no{color:var(--no);font-weight:700}
.candidate-unknown{color:#f2f5f8;font-weight:700}
.proposal-pulse{animation:proposalPulse .7s ease}
@keyframes proposalPulse{0%{box-shadow:0 0 0 0 #e7b36b66}50%{box-shadow:0 0 0 12px #e7b36b11}100%{box-shadow:0 0 0 0 #e7b36b00}}
body.artifact-proposed::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:9998;background:radial-gradient(circle at center,#ff9f2a55 0%,#140d06 35%,#000 70%);opacity:1;transition:opacity .45s ease}\nbody.artifact-proposed::after{content:"Artefact or service proposed.";position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:9999;color:#ffbf73;font-size:1.08rem;letter-spacing:.3px;font-weight:600;text-shadow:0 0 18px #ff9f2a66}
.proposal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#ff8f1f;color:#1c1108;font-size:1.16rem;font-weight:700;letter-spacing:.35px;z-index:10050;opacity:0;pointer-events:none;transition:opacity .22s ease}\.proposal-overlay.show{opacity:1}
body.flash-yes::before,body.flash-no::before,body.flash-unknown::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.28;transition:opacity .18s ease}
body.flash-yes::before{background:#00ff66}
body.flash-no::before{background:#ff3030}
body.flash-unknown::before{background:#ffffff}
</style>
</head>
<body>
  <div id="proposal-overlay" class="proposal-overlay" aria-hidden="true">Artefact or service proposed.</div>
<main class="app">
  <section class="card black-glass">
    <div class="meta debug-only" id="prototype-header"><h1>YES/NO V1 Prototype</h1><span class="badge">Prototype • Single Session • Deterministic</span></div>
    <p id="state-strip" class="hint debug-only">state: initializing | step: 0</p>
    <div class="progress-track debug-only" aria-hidden="true"><div id="progress" class="progress-fill"></div></div>
    <p id="question" class="gesture-prompt">Preparing your decision session...</p>
    <p class="covenant-line">Gesture controls<br><span class="instr-yes">O = YES</span><br><span class="instr-no">X = NO</span></p>
    <p id="candidate-line" class="candidate-line">Candidate: —</p>
    <div id="mvp-tutorial" class="tutorial-card">
      <h3>Do you understand the MVP? YES or NO</h3>
      <div>How it works:</div>
      <div class="tiny">1) Read the question</div>
      <div class="tiny">2) Draw <span class="instr-yes">O = YES</span> or <span class="instr-no">X = NO</span></div>
      <div class="tiny">3) The system asks the next question until clarity is reached</div>
      <div class="tiny">4) You receive a final decision summary</div>
      <button id="tutorial-dismiss" class="tutorial-dismiss">Got it</button>
    </div>
    <canvas id="gestureCanvas" width="1200" height="640" aria-label="gesture-input-canvas"></canvas>
    <p id="hint" class="hint strong debug-only">Draw a gesture on the black glass.</p>
    <div class="actions debug-only" id="debug-controls">
      <button id="start" class="primary">Start Session</button>
      <button id="yes" class="yes" disabled>Yes</button>
      <button id="no" class="no" disabled>No</button>
    </div>
    <label for="decision-topic" class="hint strong debug-only">Decision Topic (optional)</label>
    <input id="decision-topic" class="debug-only" type="text" placeholder="e.g. Should I move to another city?" style="width:100%;margin:6px 0 8px;padding:10px 12px;border-radius:10px;border:1px solid #334; background:#0f141c; color:#e9f0ff;" />
    <p id="topic-help" class="topic-help debug-only">Debug fallback controls (hidden by default).</p>
  </section>
  <section class="card debug-only" id="summary-panel">
    <div class="meta debug-only"><h2>Final Summary</h2><span id="status" class="badge">idle</span></div>
    <div id="result-chips" class="debug-only"></div>
    <div id="summary" class="kv debug-only"><div class="k">state</div><div>Start a session to generate a decision summary.</div></div>
    <div class="actions-secondary debug-only">
      <button id="restart" class="ghost">Start New Session</button>
      <button id="demo-alt" class="ghost">Try Alternate Path</button>
      <button id="copy-summary" class="ghost">Copy Summary</button>
    </div>
  </section>
  <section class="card debug-only" id="history-panel">
    <div class="meta"><h2>Session History (current browser)</h2><span class="badge">local only</span></div>
    <pre id="history">(no completed sessions yet)</pre>
  </section>
</main>
<script>
${gestureClassifierClientJs}
${gestureCanvasClientJs}
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
const candidateLineEl=document.getElementById('candidate-line');
const proposalOverlayEl=document.getElementById('proposal-overlay');
const tutorialEl=document.getElementById('mvp-tutorial');
const tutorialDismissBtn=document.getElementById('tutorial-dismiss');
const debugMode = new URLSearchParams(window.location.search).get('debug') === '1';
if(debugMode){ document.querySelectorAll('.debug-only').forEach((el)=>{ el.style.display = ''; }); }

try {
  const hidden = localStorage.getItem('yesno_mvp_tutorial_hidden') === '1';
  if (hidden && tutorialEl) tutorialEl.style.display = 'none';
} catch {}
if (tutorialDismissBtn) {
  tutorialDismissBtn.addEventListener('click', ()=>{
    if (tutorialEl) tutorialEl.style.display = 'none';
    try { localStorage.setItem('yesno_mvp_tutorial_hidden', '1'); } catch {}
  });
}


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



function inferProposalIcon(text=''){
  const t=(text||'').toLowerCase();
  if(t.includes('order')||t.includes('food')||t.includes('ubereats')||t.includes('drink')) return '🍽️';
  if(t.includes('music')||t.includes('song')||t.includes('playlist')) return '🎵';
  if(t.includes('podcast')) return '🎧';
  if(t.includes('book')||t.includes('massage')||t.includes('spa')||t.includes('hair')) return '💆';
  if(t.includes('doctor')||t.includes('care team')||t.includes('hospital')) return '🏥';
  if(t.includes('fix')||t.includes('taskrabbit')||t.includes('service')||t.includes('handyman')) return '🛠️';
  if(t.includes('light')||t.includes('home')||t.includes('environment')) return '🏠';
  if(t.includes('call 911')||t.includes('emergency')) return '🚨';
  if(t.includes('contact')||t.includes('friend')||t.includes('person')) return '👥';
  return '✨';
}

function triggerArtifactFeedback(){
  const card = document.getElementById('summary-panel') || summaryEl?.closest('.card');
  if(card){
    card.classList.remove('proposal-pulse');
    // reflow for repeated trigger
    void card.offsetWidth;
    card.classList.add('proposal-pulse');
  }
  document.body.classList.remove('artifact-proposed');
  void document.body.offsetWidth;
  document.body.classList.add('artifact-proposed');
  if(proposalOverlayEl){
    proposalOverlayEl.classList.remove('show');
    void proposalOverlayEl.offsetWidth;
    proposalOverlayEl.classList.add('show');
    setTimeout(()=>proposalOverlayEl.classList.remove('show'), 1500);
  }
  setTimeout(()=>document.body.classList.remove('artifact-proposed'), 1500);
}

function renderSummaryCard(summary, topic){
  if(!summaryEl) return;
  const confidence=Number(summary.final_confidence).toFixed(2);
  const meaning=(summary.gate_result==='GO')
    ? 'Proceed with confidence and keep scope focused.'
    : (summary.gate_result==='REVIEW')
      ? 'Pause and clarify before committing.'
      : 'Hold this decision and reduce uncertainty first.';
  const proposalIcon = inferProposalIcon(summary.expected_effect||summary.primary_reason||'');
  const intentLine=(summary.gate_result==='GO')
    ? 'Intent signal: action-ready. You likely know what you want now.'
    : (summary.gate_result==='REVIEW')
      ? 'Intent signal: mixed. You want movement, but need one more clarity pass.'
      : 'Intent signal: protective. You may benefit from waiting before acting.';
  summaryEl.innerHTML=''
    +'<div class="summary-topic">Decision Topic: <span class="summary-value">'+(topic||'Not specified')+'</span></div>'
    +'<div class="summary-lede">Final Decision: <span class="summary-value">'+summary.gate_result+'</span> • Guard: <span class="summary-value">'+summary.guard_status+'</span> • Confidence: <span class="summary-value">'+confidence+'</span></div>'
    +'<ul class="summary-checklist">'
    +'<li><span class="summary-value">What this means:</span> '+meaning+'</li>'
    +'<li><span class="summary-value">Intent insight:</span> '+intentLine+'</li>'
    +'<li><span class="summary-value">Primary reason:</span> '+summary.primary_reason+'</li>'
    +'<li><span class=\"summary-value\">Expected effect:</span> '+summary.expected_effect+'</li>'
    +'<li><span class=\"summary-value\">Proposal category:</span> '+proposalIcon+' inferred from current intent</li>'
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
  questionEl.textContent='Is there something you want right now?';
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



// Phase 4: mounted gesture pipeline (classifier + canvas modules)
if(gestureCanvas && window.__gestureClassifier && window.__mountGestureCanvas){
  window.__mountGestureCanvas({
    canvas: gestureCanvas,
    hintEl,
    classifyGesture: window.__gestureClassifier.classifyGesture,
    earlyStrokeIntent: window.__gestureClassifier.earlyStrokeIntent,
    onSubmit: async (normalized)=>{
      if (normalized === 'yes' || normalized === 'no') {
        console.log(JSON.stringify({ event: 'gesture_submitted', normalized_answer: normalized }));
        await answer(normalized);
      }
    },
    onUnknown: ()=>{
      console.log(JSON.stringify({ event: 'gesture_unknown_retry', reason: 'unrecognized_gesture' }));
    },
    onCandidate: (candidate)=>{
      if(!candidateLineEl) return;
      if(candidate==='yes'){ candidateLineEl.innerHTML='Candidate: <span class="candidate-yes">YES</span>'; }
      else if(candidate==='no'){ candidateLineEl.innerHTML='Candidate: <span class="candidate-no">NO</span>'; }
      else { candidateLineEl.innerHTML='Candidate: <span class="candidate-unknown">UNKNOWN</span>'; }
    },
    onDetected: (result)=>{
      if(result==='yes') console.log(JSON.stringify({ event: 'gesture_detected_yes' }));
      else if(result==='no') console.log(JSON.stringify({ event: 'gesture_detected_no' }));
      else console.log(JSON.stringify({ event: 'gesture_unknown_retry', reason: 'classifier_unknown' }));
    },
  });
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
