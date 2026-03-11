import { createServer } from 'node:http';
import { handleWebV1 } from './handler';

const port = Number(process.env.PORT || 3100);
createServer((req, res) => handleWebV1(req, res)).listen(port, () => {
  console.log(`web-v1 listening on :${port}`);
});
