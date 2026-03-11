import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

function sh(cmd: string): string {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8').trim();
  } catch {
    return '';
  }
}

const now = new Date().toISOString();
const branch = sh('git rev-parse --abbrev-ref HEAD');
const sha = sh('git rev-parse --short HEAD');
const openPrs = sh("gh pr list -R LUW-president/yes-no --state open --json number,title --jq 'length' || true") || 'unknown';

const report = `# Self-Trigger Loop Report\n\n- Time: ${now}\n- Branch: ${branch}\n- SHA: ${sha}\n- Open PR count: ${openPrs}\n\n## Gate snapshot\n- test:v1-summary\n- test:v1-cli\n- test:v1-e2e\n- test:orchestrator\n\nStatus: automated loop heartbeat completed.\n`;

mkdirSync('ops/reports', { recursive: true });
writeFileSync('ops/reports/self-trigger-loop-latest.md', report);
console.log('self-trigger report generated');
