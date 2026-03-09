import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getFirstQuestion, loadPack, resolveNext } from '../index';
import { loadPackFromPath } from '../packLoader';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function assertThrows(fn: () => void, msg: string) {
  let thrown = false;
  try { fn(); } catch { thrown = true; }
  if (!thrown) throw new Error(msg);
}

const dir = mkdtempSync(join(tmpdir(), 'yesno-pack-'));

const validPackPath = join(dir, 'valid.yaml');
writeFileSync(validPackPath, `
pack_id: creation_v0
version: 0.1

questions:
  - id: q_create
    text: "Would you like to create something?"
    yes: q_art
    no: end

  - id: q_art
    text: "Would you like to create an art project?"
    yes: artifact_image
    no: end
`);

const invalidPackPath = join(dir, 'invalid.yaml');
writeFileSync(invalidPackPath, `
pack_id: bad
version: 0.1
questions:
  - id: q1
    text: "Q1"
    yes: q2
    no: end
`);

// pack loading
const loaded = loadPack(validPackPath);
assert(loaded.pack_id === 'creation_v0', 'pack loading failed');

// deterministic transitions
const first = getFirstQuestion('creation_v0');
assert(first.id === 'q_create', 'first question failed');

const n1 = resolveNext('q_create', 'yes');
assert(n1.kind === 'question' && n1.next_question_id === 'q_art', 'yes transition failed');

const n2 = resolveNext('q_create', 'no');
assert(n2.kind === 'end', 'end transition failed');

const n3 = resolveNext('q_art', 'yes');
assert(n3.kind === 'artifact' && n3.artifact_trigger === 'artifact_image', 'artifact transition failed');

// invalid pack detection
assertThrows(() => loadPackFromPath(invalidPackPath), 'invalid pack should throw (missing transition target)');

// invalid answer
assertThrows(() => resolveNext('q_create', 'maybe' as any), 'invalid answer should throw');

console.log('question engine tests passed');
