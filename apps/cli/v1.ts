import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { buildSessionDecisionSummary, recordAnswer, startSession } from '../../engine/session-orchestrator';

type BinaryAnswer = 'yes' | 'no';

type CliIO = {
  print: (line: string) => void;
  readLine: (prompt: string) => Promise<string>;
  close?: () => void;
};

function getArg(flag: string, argv: string[]): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return undefined;
}

function parseAnswer(raw: string): BinaryAnswer | null {
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'y' || normalized === 'yes') return 'yes';
  if (normalized === 'n' || normalized === 'no') return 'no';
  return null;
}

function parseAnswersArg(argv: string[]): BinaryAnswer[] {
  const value = getArg('--answers', argv);
  if (!value) return [];

  return value
    .split(',')
    .map((part) => parseAnswer(part))
    .filter((answer): answer is BinaryAnswer => answer !== null);
}

export function formatV1SummaryOutput(summary: {
  final_confidence: number;
  explanation: { explanation: string }[];
  guard: { final_status: string; findings: { rule: string; recommendation: string }[] };
  improve: { pattern: string; rule_chain: string; expected_effect: string };
  gate: { result: string; primary_reason: string };
}): string {
  const lines: string[] = [
    'SESSION DECISION SUMMARY (V1 PROTOTYPE / NON-PRODUCTION)',
    '',
    `final confidence: ${summary.final_confidence.toFixed(2)}`,
    '',
    'explanation:',
    ...summary.explanation.map((step) => `- ${step.explanation}`),
    '',
    `guard status: ${summary.guard.final_status}`,
  ];

  if (summary.guard.findings.length === 0) {
    lines.push('guard findings: none');
  } else {
    lines.push('guard findings:');
    for (const finding of summary.guard.findings) {
      lines.push(`- ${finding.rule}: ${finding.recommendation}`);
    }
  }

  lines.push('', 'follow-up recommendation:');
  lines.push(`- pattern: ${summary.improve.pattern}`);
  lines.push(`- rule chain: ${summary.improve.rule_chain}`);
  lines.push(`- expected effect: ${summary.improve.expected_effect}`);
  lines.push('', `gate result: ${summary.gate.result} (${summary.gate.primary_reason})`);

  return lines.join('\n');
}

function createDefaultIO(): CliIO {
  const rl = createInterface({ input, output });
  return {
    print: (line) => console.log(line),
    readLine: async (prompt) => {
      const answer = await rl.question(prompt);
      return answer;
    },
    close: () => rl.close(),
  };
}

export async function v1Command(argv: string[] = [], io?: CliIO): Promise<void> {
  const selectedIO = io ?? createDefaultIO();
  const userId = getArg('--user', argv) ?? 'v1_cli_user';
  const packId = getArg('--pack', argv) ?? 'creation_v0';
  const scriptedAnswers = parseAnswersArg(argv);

  const started = startSession(userId, packId);

  selectedIO.print('YES/NO V1 SESSION (prototype / non-production)');
  selectedIO.print(`session: ${started.session.session_id}`);

  let answerIndex = 0;
  let currentQuestion = started.question_text;
  let currentSession = started.session;

  while (true) {
    selectedIO.print(`\nquestion: ${currentQuestion}`);

    let answer: BinaryAnswer | null = null;
    if (answerIndex < scriptedAnswers.length) {
      answer = scriptedAnswers[answerIndex];
      selectedIO.print(`answer: ${answer}`);
    } else {
      while (!answer) {
        const raw = await selectedIO.readLine('answer (yes/no): ');
        answer = parseAnswer(raw);
        if (!answer) selectedIO.print('Please answer yes or no.');
      }
    }

    answerIndex += 1;
    const next = recordAnswer(currentSession, answer);

    if (next.kind === 'question') {
      currentSession = next.session;
      currentQuestion = next.question_text;
      continue;
    }

    if (next.kind === 'artifact') {
      selectedIO.print(`artifact proposed: ${next.artifact_trigger}`);
      currentSession = next.session;
      break;
    }

    break;
  }

  const summary = buildSessionDecisionSummary(currentSession.session_id);
  selectedIO.print('');
  selectedIO.print(formatV1SummaryOutput(summary));

  if (selectedIO.close) selectedIO.close();
}
