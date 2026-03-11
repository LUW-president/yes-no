import { IncomingMessage, ServerResponse } from 'node:http';
import { handleWebV1Request } from './handler.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await handleWebV1Request(req, res);
}
