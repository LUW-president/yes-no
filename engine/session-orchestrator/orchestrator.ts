import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEvent, InMemoryEventStore, ProtocolStreamEvent } from '../protocol';
import { createEmptyProfile, updateProfileFromEvent, UserProfile } from '../memory-engine';
import { loadPackFromPath } from '../question-engine/packLoader';
import { resolveNextInPack } from '../question-engine/resolver';
import { LoadedPack } from '../question-engine/types';
import { RecordAnswerResult, SessionState, StartSessionResult } from './types';

const eventStore = new InMemoryEventStore();
const sessions = new Map<string, SessionState>();
const profiles = new Map<string, UserProfile>();
const packs = new Map<string, LoadedPack>();

let seq = 0;
function id(prefix: string) {
  seq += 1;
  return `${prefix}_${seq}`;
}

function nowIso() {
  return new Date().toISOString();
}

function countRecordedAnswers(session_id: string): number {
  return eventStore.getSessionEvents(session_id).filter((e) => e.event_type === 'answer.recorded').length;
}

function resolvePackBases(): string[] {
  const here = dirname(fileURLToPath(import.meta.url));
  return [
    process.env.YESNO_PACKS_DIR || '',
    join(process.cwd(), 'content', 'packs'),
    join(here, '..', '..', 'content', 'packs'),
    '/var/task/content/packs',
  ].filter(Boolean);
}

function loadPackById(pack_id: string): LoadedPack {
  if (packs.has(pack_id)) return packs.get(pack_id)!;

  for (const base of resolvePackBases()) {
    try {
      const files = readdirSync(base).filter((f) => f.endsWith('.yaml'));
      for (const f of files) {
        const p = loadPackFromPath(join(base, f));
        if (p.pack_id === pack_id) {
          packs.set(pack_id, p);
          return p;
        }
      }
    } catch {
      // try next candidate base
    }
  }

  throw new Error(`Pack not found: ${pack_id}`);
}

export function startSession(user_id: string, pack_id: string): StartSessionResult {
  const pack = loadPackById(pack_id);
  const first = pack.questions[0];
  if (!first) throw new Error(`Pack has no questions: ${pack_id}`);

  const ts = nowIso();
  const session: SessionState = {
    session_id: id('session'),
    user_id,
    pack_id,
    current_question_id: first.id,
    status: 'active',
    started_at: ts,
    last_event_at: ts,
  };

  sessions.set(session.session_id, session);
  if (!profiles.has(user_id)) profiles.set(user_id, createEmptyProfile(user_id));

  const e = createEvent({
    event_id: id('evt'),
    event_type: 'question.presented',
    timestamp: ts,
    session_id: session.session_id,
    user_id,
    question_id: first.id,
    question_text: first.text,
    channel: 'app',
  });
  eventStore.appendEvent(e);

  return { session, question_text: first.text };
}

export function recordAnswer(session: SessionState, answer: 'yes' | 'no'): RecordAnswerResult {
  const s = sessions.get(session.session_id);
  if (!s) throw new Error(`Session not found: ${session.session_id}`);
  if (s.status !== 'active') throw new Error(`Session not active: ${session.session_id}`);

  const pack = loadPackById(s.pack_id);
  const current = pack.questionMap.get(s.current_question_id);
  if (!current) throw new Error(`Question not found in session pack: ${s.current_question_id}`);

  const ts = nowIso();
  const submittedEvent = createEvent({
    event_id: id('evt'),
    event_type: 'answer.submitted',
    timestamp: ts,
    session_id: s.session_id,
    user_id: s.user_id,
    question_id: s.current_question_id,
    answer,
    input_mode: 'tap',
    latency_ms: 0,
  });
  eventStore.appendEvent(submittedEvent);

  const answerEvent = createEvent({
    event_id: id('evt'),
    event_type: 'answer.recorded',
    timestamp: ts,
    session_id: s.session_id,
    user_id: s.user_id,
    question_id: s.current_question_id,
    answer,
    input_mode: 'tap',
    latency_ms: 0,
  });
  eventStore.appendEvent(answerEvent);

  const profile = profiles.get(s.user_id) ?? createEmptyProfile(s.user_id);
  profiles.set(s.user_id, updateProfileFromEvent(profile, answerEvent));

  const resolved = resolveNextInPack(pack, s.current_question_id, answer);

  if (resolved.kind === 'question') {
    const next = pack.questionMap.get(resolved.next_question_id);
    if (!next) throw new Error(`Transition target missing: ${resolved.next_question_id}`);

    s.current_question_id = next.id;
    s.last_event_at = nowIso();

    const qEvent = createEvent({
      event_id: id('evt'),
      event_type: 'question.presented',
      timestamp: s.last_event_at,
      session_id: s.session_id,
      user_id: s.user_id,
      question_id: next.id,
      question_text: next.text,
      channel: 'app',
    });
    eventStore.appendEvent(qEvent);

    const updatedEvent = createEvent({
      event_id: id('evt'),
      event_type: 'session.updated',
      timestamp: nowIso(),
      session_id: s.session_id,
      user_id: s.user_id,
      stage: 'question',
      answered_count: countRecordedAnswers(s.session_id),
    });
    eventStore.appendEvent(updatedEvent);

    return { kind: 'question', session: s, question_text: next.text };
  }

  if (resolved.kind === 'artifact') {
    s.last_event_at = nowIso();
    const aEvent = createEvent({
      event_id: id('evt'),
      event_type: 'artifact.proposed',
      timestamp: s.last_event_at,
      session_id: s.session_id,
      user_id: s.user_id,
      artifact_id: resolved.artifact_trigger,
      artifact_type: resolved.artifact_trigger.includes('film')
        ? 'film'
        : resolved.artifact_trigger.includes('image')
          ? 'image'
          : resolved.artifact_trigger.includes('idea')
            ? 'idea'
            : 'other',
      source_question_ids: [current.id],
    });
    eventStore.appendEvent(aEvent);

    const p = profiles.get(s.user_id)!;
    profiles.set(s.user_id, updateProfileFromEvent(p, aEvent));

    const updatedEvent = createEvent({
      event_id: id('evt'),
      event_type: 'session.updated',
      timestamp: nowIso(),
      session_id: s.session_id,
      user_id: s.user_id,
      stage: 'artifact',
      answered_count: countRecordedAnswers(s.session_id),
    });
    eventStore.appendEvent(updatedEvent);

    return { kind: 'artifact', session: s, artifact_trigger: resolved.artifact_trigger };
  }

  s.status = 'completed';
  s.last_event_at = nowIso();
  const closeEvent = createEvent({
    event_id: id('evt'),
    event_type: 'session.closed',
    timestamp: s.last_event_at,
    session_id: s.session_id,
    user_id: s.user_id,
    close_reason: 'completed',
  });
  eventStore.appendEvent(closeEvent);

  const updatedEvent = createEvent({
    event_id: id('evt'),
    event_type: 'session.updated',
    timestamp: nowIso(),
    session_id: s.session_id,
    user_id: s.user_id,
    stage: 'completed',
    answered_count: countRecordedAnswers(s.session_id),
  });
  eventStore.appendEvent(updatedEvent);

  return { kind: 'end', session: s };
}

export function getSessionState(session_id: string): SessionState {
  const s = sessions.get(session_id);
  if (!s) throw new Error(`Session not found: ${session_id}`);
  return s;
}

export function __getProfile(user_id: string): UserProfile {
  const p = profiles.get(user_id);
  if (!p) throw new Error(`Profile not found: ${user_id}`);
  return p;
}

export function getSessionEventStream(session_id: string): ProtocolStreamEvent[] {
  return eventStore.getSessionEvents(session_id);
}

export function __getSessionEventStream(session_id: string): ProtocolStreamEvent[] {
  return getSessionEventStream(session_id);
}

export function __resetForTests(): void {
  sessions.clear();
  profiles.clear();
  packs.clear();
  seq = 0;
}
