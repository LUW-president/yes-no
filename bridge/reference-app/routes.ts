import { IncomingMessage, ServerResponse } from 'node:http';
import {
  getSessionStateController,
  getSessionSummaryController,
  startSessionController,
  submitAnswerController,
} from './sessionController.js';

async function readJsonBody(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8') || '{}';
  return JSON.parse(raw);
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    const method = req.method || 'GET';
    const url = req.url || '/';

    if (method === 'POST' && url === '/session/start') {
      const body = await readJsonBody(req);
      const out = startSessionController(body);
      return sendJson(res, 200, out);
    }

    if (method === 'POST' && url === '/session/answer') {
      const body = await readJsonBody(req);
      const out = submitAnswerController(body);
      return sendJson(res, 200, out);
    }

    if (method === 'GET' && url.startsWith('/session/') && url.endsWith('/summary')) {
      const session_id = decodeURIComponent(url.replace('/session/', '').replace('/summary', ''));
      const out = getSessionSummaryController(session_id);
      return sendJson(res, 200, out);
    }

    if (method === 'GET' && url.startsWith('/session/')) {
      const session_id = decodeURIComponent(url.replace('/session/', ''));
      const out = getSessionStateController(session_id);
      return sendJson(res, 200, out);
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (err: any) {
    return sendJson(res, 400, { error: err?.message || 'Bad request' });
  }
}
