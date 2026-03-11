import { createServer } from 'node:http';
import { handleWebV1Request } from './handler.js';

export function startWebV1Server(port = 3000) {
  const server = createServer((req, res) => {
    void handleWebV1Request(req, res);
  });

  server.listen(port);
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  startWebV1Server(port);
  console.log(`web-v1 listening on :${port}`);
}
