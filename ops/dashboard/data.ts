export type DashboardComponent = {
  name: string;
  status: 'stable';
  description: string;
};

export type StatusDashboardData = {
  release: string;
  components: DashboardComponent[];
  commands: string[];
  testStatus: string;
  nextMilestone: string;
};

export const STATUS_DASHBOARD_DATA: StatusDashboardData = {
  release: 'v0 Internal Baseline',
  components: [
    { name: 'protocol', status: 'stable', description: 'Deterministic event protocol foundation.' },
    { name: 'question engine', status: 'stable', description: 'Binary question flow engine.' },
    { name: 'memory engine', status: 'stable', description: 'Signal/state memory evaluation.' },
    { name: 'session orchestrator', status: 'stable', description: 'Session lifecycle + transitions.' },
    { name: 'CLI runner', status: 'stable', description: 'Interactive CLI session runner.' },
    { name: 'UX harness', status: 'stable', description: 'Console UX validation harness.' },
    { name: 'CLI packaging layer', status: 'stable', description: 'Unified yesno command surface.' },
    { name: 'demo script', status: 'stable', description: 'Deterministic no-input demo run.' },
    { name: 'reference bridge', status: 'stable', description: 'Minimal HTTP orchestration bridge.' },
    { name: 'mobile adapter', status: 'stable', description: 'Mobile client bridge adapter.' },
    { name: 'web adapter', status: 'stable', description: 'Web client bridge adapter.' },
    { name: 'mobile reference app', status: 'stable', description: 'Mobile-style interaction reference UI.' },
    { name: 'web reference app', status: 'stable', description: 'Web-style interaction reference UI.' },
  ],
  commands: ['yesno run', 'yesno harness', 'yesno demo', 'yesno status'],
  testStatus: 'All modules passing',
  nextMilestone: 'Native mobile UI prototype',
};
