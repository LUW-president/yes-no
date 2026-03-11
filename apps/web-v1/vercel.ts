import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleWebV1 } from './handler';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return handleWebV1(req, res);
}
