import { IncomingMessage, ServerResponse } from 'node:http';
import {
  getSessionSummaryController,
  startSessionController,
  submitAnswerController,
} from '../../bridge/reference-app/sessionController';

async function readJsonBody(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8') || '{}';
  return JSON.parse(raw);
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

const page = `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>YES/NO V1 Prototype</title>
<style>body{font-family:Arial;background:#111;color:#eee;max-width:680px;margin:40px auto;padding:16px}button{padding:10px 16px;margin-right:8px}pre{background:#1d1d1d;padding:10px;white-space:pre-wrap}</style>
</head><body>
<h1>YES/NO V1 (Prototype)</h1>
<p id="q">Press Start Session</p>
<button id="start">Start Session</button>
<button id="yes" disabled>YES</button><button id="no" disabled>NO</button>
<pre id="out"></pre>
<script>
let sessionId=null;
const q=document.getElementById('q'); const out=document.getElementById('out');
const yes=document.getElementById('yes'); const no=document.getElementById('no');
function setActive(v){yes.disabled=!v;no.disabled=!v;}
async function post(url,body){const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});return r.json();}
async function showSummary(){const s=await fetch('/api/session/'+encodeURIComponent(sessionId)+'/summary').then(r=>r.json());
out.textContent=['SESSION SUMMARY (PROTOTYPE)','final confidence: '+s.final_confidence,'guard status: '+s.guard_status,'gate result: '+s.gate_result,'primary reason: '+s.primary_reason,'expected effect: '+s.expected_effect].join('\n');}
document.getElementById('start').onclick=async()=>{const r=await post('/api/session/start',{user_id:'web_v1_user',pack_id:'creation_v0'});sessionId=r.session_id;q.textContent=r.question;setActive(true);out.textContent='';};
async function answer(a){const r=await post('/api/session/answer',{session_id:sessionId,answer:a}); if(r.next_question){q.textContent=r.next_question; return;} if(r.artifact_proposed){q.textContent='Artifact proposed: '+r.artifact_proposed; return;} if(r.session_complete){setActive(false); q.textContent='Session complete'; await showSummary();}}
yes.onclick=()=>answer('yes'); no.onclick=()=>answer('no');
</script></body></html>`;

export async function handleWebV1(req: IncomingMessage, res: ServerResponse) {
  try {
    const method = req.method || 'GET';
    const url = req.url || '/';

    if (method === 'GET' && url === '/') return sendHtml(res, page);

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
  } catch (e: any) {
    return sendJson(res, 400, { error: e?.message || 'Bad request' });
  }
}
