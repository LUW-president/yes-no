export type Answer = 'yes' | 'no';

export type TransitionTarget = string; // question id | end | artifact_*

export type QuestionNode = {
  id: string;
  text: string;
  yes: TransitionTarget;
  no: TransitionTarget;
};

export type QuestionPack = {
  pack_id: string;
  version: string;
  questions: QuestionNode[];
};

export type LoadedPack = QuestionPack & {
  questionMap: Map<string, QuestionNode>;
};

export type ResolveResult =
  | { kind: 'question'; next_question_id: string }
  | { kind: 'artifact'; artifact_trigger: string }
  | { kind: 'end' };
