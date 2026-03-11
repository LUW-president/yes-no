import { IncomingMessage, ServerResponse } from 'node:http';
import {
  getSessionSummaryController,
  startSessionController,
  submitAnswerController,
} from '../../bridge/reference-app/sessionController';

const pageHtml = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>YES/NO V1 Prototype</title>
<style>:root{font-family:system-ui,sans-serif}body{margin:0;padding:24px}.app{max-width:640px;margin:0 auto;display:grid;gap:12px}.card{border:1px solid #7774;border-radius:10px;padding:16px}button{padding:10px 16px;margin-right:8px}pre{white-space:pre-wrap}</style>
</head>
<body>
<main class="app">
  <h1>YES/NO V1 Prototype</h1>
  <div class="card">
    <button id="start">Start Session</button>
    <p id="question">Press start to begin.</p>
    <div><button id="yes" disabled>Yes</button><button id="no" disabled>No</button></div>
  </div>
  <div class="card"><h2>Final Summary</h2><pre id="summary">(not available yet)</pre></div>
</main>
<script>
const startBtn=document.getElementById('start');const yesBtn=document.getElementById('yes');const noBtn=document.getElementById('no');const questionEl=document.getElementById('question');const summaryEl=document.getElementById('summary');
let sessionId=null;function setAnswerButtons(enabled){yesBtn.disabled=!enabled;noBtn.disabled=!enabled;}
async function startSession(){summaryEl.textContent='(not available yet)';const response=await fetch('/api/session/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:'web_v1_user',pack_id:'creation_v0'})});const out=await response.json();if(!response.ok)throw new Error(out.error||'start failed');sessionId=out.session_id;questionEl.textContent=out.question;setAnswerButtons(true);}
async function answer(value){if(!sessionId)return;const response=await fetch('/api/session/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sessionId,answer:value})});const out=await response.json();if(!response.ok)throw new Error(out.error||'answer failed');if(out.next_question){questionEl.textContent=out.next_question;return;}setAnswerButtons(false);questionEl.textContent=out.artifact_proposed?'Artifact proposed. Session complete.':'Session complete.';const summaryResponse=await fetch('/api/session/'+encodeURIComponent(sessionId)+'/summary');const summary=await summaryResponse.json();summaryEl.textContent=JSON.stringify({confidence:summary.final_confidence,guard_status:summary.guard_status,gate_result:summary.gate_result,primary_reason:summary.primary_reason,expected_effect:summary.expected_effect},null,2);}
startBtn.addEventListener('click',()=>startSession().catch((err)=>{questionEl.textContent='Failed to start session: '+(err&&err.message?err.message:String(err));setAnswerButtons(false);}));yesBtn.addEventListener('click',()=>answer('yes').catch((err)=>{questionEl.textContent='Failed to submit answer: '+(err&&err.message?err.message:String(err));}));noBtn.addEventListener('click',()=>answer('no').catch((err)=>{questionEl.textContent='Failed to submit answer: '+(err&&err.message?err.message:String(err));}));
</script>
</body>
</html>`;

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
      return sendJson(res, 200, startSessionController(body));
    }

    if (method === 'POST' && url === '/api/session/answer') {
      const body = await readJsonBody(req);
      return sendJson(res, 200, submitAnswerController(body));
    }

    if (method === 'GET' && url.startsWith('/api/session/') && url.endsWith('/summary')) {
      const session_id = decodeURIComponent(url.replace('/api/session/', '').replace('/summary', ''));
      return sendJson(res, 200, getSessionSummaryController(session_id));
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (err: any) {
    return sendJson(res, 400, { error: err?.message || 'Bad request' });
  }
}
