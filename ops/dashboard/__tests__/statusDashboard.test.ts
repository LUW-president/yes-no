import { STATUS_DASHBOARD_DATA } from '../data';
import { renderStatusDashboard } from '../render';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

// data structure
assert(STATUS_DASHBOARD_DATA.release === 'v0 Internal Baseline', 'release mismatch');
assert(STATUS_DASHBOARD_DATA.components.length === 13, 'components count mismatch');
assert(STATUS_DASHBOARD_DATA.components.every((c) => c.status === 'stable'), 'component status must be stable');

// command list integrity
const expected = ['yesno run', 'yesno harness', 'yesno demo', 'yesno status'];
for (const cmd of expected) {
  assert(STATUS_DASHBOARD_DATA.commands.includes(cmd), `missing command: ${cmd}`);
}

// rendering sections
const out = renderStatusDashboard(STATUS_DASHBOARD_DATA);
assert(out.includes('YES/NO STATUS DASHBOARD'), 'missing header');
assert(out.includes('BASELINE'), 'missing baseline section');
assert(out.includes('COMPONENTS'), 'missing components section');
assert(out.includes('COMMANDS'), 'missing commands section');
assert(out.includes('TEST STATUS\nAll modules passing'), 'missing test status');
assert(out.includes('NEXT MILESTONE\nNative mobile UI prototype'), 'missing next milestone');

console.log('status dashboard tests passed');
