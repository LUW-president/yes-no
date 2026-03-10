#!/usr/bin/env node
import { STATUS_DASHBOARD_DATA } from './data';
import { renderStatusDashboard } from './render';

export function getDashboardOutput(): string {
  return renderStatusDashboard(STATUS_DASHBOARD_DATA);
}

export function runStatusDashboard() {
  const output = getDashboardOutput();
  console.log(output);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runStatusDashboard();
}
