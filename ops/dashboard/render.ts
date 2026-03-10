import type { StatusDashboardData } from './data';

export function renderStatusDashboard(data: StatusDashboardData): string {
  const components = data.components
    .map((c) => `- ${c.name} [${c.status}] — ${c.description}`)
    .join('\n');

  const commands = data.commands.map((c) => `- ${c}`).join('\n');

  return [
    '--------------------------------',
    'YES/NO STATUS DASHBOARD',
    '--------------------------------',
    '',
    'BASELINE',
    `Release: ${data.release}`,
    '',
    'COMPONENTS',
    components,
    '',
    'COMMANDS',
    commands,
    '',
    'TEST STATUS',
    data.testStatus,
    '',
    'NEXT MILESTONE',
    data.nextMilestone,
  ].join('\n');
}
