import { createServer } from 'node:http';
import { handleRequest } from './routes';

export function startReferenceBridgeServer(port = 3000) {
  const server = createServer((req, res) => {
    handleRequest(req, res);
  });

  server.listen(port);
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  startReferenceBridgeServer(port);
  console.log(`reference-app bridge listening on :${port}`);
}
