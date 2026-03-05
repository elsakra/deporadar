import type {
  HeuristicResult,
  TranscriptLine,
  RadarCategory,
  RadarSubtype,
} from "@/types";
import { CONFIDENCE_FLOOR } from "@/types";

function result(
  fired: boolean,
  subtype: RadarSubtype,
  confidence: number,
  excerpt: string,
  suggestedText: string,
  category: RadarCategory
): HeuristicResult {
  return { fired, subtype, confidence, excerpt, suggestedText, category };
}

function noFire(subtype: RadarSubtype): HeuristicResult {
  return result(false, subtype, 0, "", "", "FORM");
}

// ── 1. Privilege Probe ──

const PRIVILEGE_TERMS = [
  /\b(?:your\s+)?attorney\b/i,
  /\b(?:your\s+)?lawyer\b/i,
  /\b(?:your\s+)?counsel\b/i,
  /\blegal\s+advice\b/i,
  /\blitigation\s+strategy\b/i,
  /\bwork\s*product\b/i,
  /\bcommunications?\s+with\s+(?:your\s+)?(?:attorney|lawyer|counsel)\b/i,
  /\bdiscuss(?:ed|ion)?\b.*\b(?:with\s+)?(?:your\s+)?(?:attorney|lawyer|counsel)\b/i,
];

const WORK_PRODUCT_TERMS = [
  /\battorney\b.*\b(?:show|give|provide|share|prepare|document|photograph|exhibit)/i,
  /\b(?:show|give|provide|share|prepare)\b.*\b(?:your\s+)?(?:attorney|lawyer|counsel)\b/i,
  /\bprepare\b.*\btestimony\b.*\b(?:attorney|lawyer|counsel)\b/i,
  /\b(?:attorney|lawyer|counsel)\b.*\bprepare\b.*\b(?:testimony|deposition)\b/i,
];

function checkPrivilege(line: TranscriptLine): HeuristicResult {
  const text = line.text;

  for (const pat of WORK_PRODUCT_TERMS) {
    if (pat.test(text)) {
      return result(
        true,
        "work_product_probe",
        0.9,
        text,
        "Privilege. Work product. Instruct not to answer.",
        "PRIVILEGE"
      );
    }
  }

  for (const pat of PRIVILEGE_TERMS) {
    if (pat.test(text)) {
      return result(
        true,
        "privilege_probe",
        0.9,
        text,
        "Privilege. Instruct not to answer.",
        "PRIVILEGE"
      );
    }
  }

  return noFire("privilege_probe");
}

// ── 2. Compound ──

const COMPOUND_JOINERS = [
  /\band\s+also\b/i,
  /\bas\s+well\s+as\b/i,
  /\band\s+(?:additionally|further(?:more)?|in\s+addition)\b/i,
];

const COMPOUND_MULTI_Q =
  /(?:(?:can|could|would|will|do|did|have|has|are|is|were|was)\s+you\b[^?]*\?[^?]*(?:and|,)\s*(?:can|could|would|will|do|did|have|has|are|is|were|was)\s+you\b)/i;

const COMPOUND_AND_WHAT =
  /\b(?:and\s+(?:what|how|when|where|why|who|which|tell\s+us|describe)\b)/i;

const COMPOUND_AND_AUX =
  /\band\s+(?:did|do|does|can|could|would|will|have|has|are|is|were|was)\s+(?:you|they|he|she|we|it)\b/i;

function checkCompound(line: TranscriptLine): HeuristicResult {
  const text = line.text;

  if (COMPOUND_MULTI_Q.test(text)) {
    return result(
      true,
      "compound",
      0.88,
      text,
      "Object to form -- compound.",
      "FORM"
    );
  }

  for (const pat of COMPOUND_JOINERS) {
    if (pat.test(text)) {
      return result(
        true,
        "compound",
        0.85,
        text,
        "Object to form -- compound.",
        "FORM"
      );
    }
  }

  if (COMPOUND_AND_WHAT.test(text)) {
    const parts = text.split(COMPOUND_AND_WHAT);
    if (parts.length >= 2 && parts[0].trim().length > 20) {
      return result(
        true,
        "compound",
        0.82,
        text,
        "Object to form -- compound.",
        "FORM"
      );
    }
  }

  const auxMatches = text.match(new RegExp(COMPOUND_AND_AUX.source, "gi"));
  if (auxMatches && auxMatches.length >= 1 && text.length > 60) {
    return result(
      true,
      "compound",
      0.86,
      text,
      "Object to form -- compound.",
      "FORM"
    );
  }

  return noFire("compound");
}

// ── 3. Mischaracterizes ──

const MISCHAR_PATTERNS = [
  /\bso\s+you(?:'re|\s+are)\s+saying\b/i,
  /\bisn'?t\s+it\s+(?:true|correct|fair\s+to\s+say)\s+that\b/i,
  /\byou\s+(?:testified|stated|said|told\s+us)\s+(?:that|earlier)\b/i,
  /\bso\s+(?:your|the)\s+testimony\s+is\b/i,
  /\byou(?:'re|\s+are)\s+(?:telling|saying)\s+(?:us|me|this\s+jury)\s+that\b/i,
];

function checkMischaracterizes(
  line: TranscriptLine,
  context: TranscriptLine[]
): HeuristicResult {
  const text = line.text;

  for (const pat of MISCHAR_PATTERNS) {
    if (pat.test(text)) {
      const hasNegation =
        /\bnever\b|\bnot?\b|\bno\b|\bnone\b|\bnothing\b|\bdidn'?t\b|\bwasn'?t\b|\baren'?t\b|\bweren'?t\b/i.test(
          text
        );
      const conf = hasNegation ? 0.88 : 0.82;

      return result(
        true,
        "mischaracterizes",
        conf,
        text,
        "Object to form -- mischaracterizes prior testimony.",
        "FORM"
      );
    }
  }

  return noFire("mischaracterizes");
}

// ── 4. Vague ──

const VAGUE_PHRASES = [
  /\bthings?\s+like\s+that\b/i,
  /\bstuff\s+like\s+that\b/i,
  /\byou\s+know\b/i,
  /\bmore\s+or\s+less\b/i,
  /\bthe\s+general\s+(?:situation|area|idea|gist|thing)\b/i,
  /\bsort\s+of\b/i,
  /\bkind\s+of\b/i,
  /\bwhatever\b/i,
  /\band\s+(?:stuff|whatnot|so\s+on|so\s+forth)\b/i,
  /\betc\.?\b/i,
];

function checkVague(line: TranscriptLine): HeuristicResult {
  const text = line.text;
  let matches = 0;

  for (const pat of VAGUE_PHRASES) {
    if (pat.test(text)) matches++;
  }

  if (matches >= 2) {
    return result(
      true,
      "vague",
      0.85,
      text,
      "Object to form -- vague.",
      "FORM"
    );
  }
  if (matches === 1) {
    return result(
      true,
      "vague",
      0.78,
      text,
      "Object to form -- vague.",
      "FORM"
    );
  }

  return noFire("vague");
}

// ── 5. Assumes Facts ──

const ASSUMES_PATTERNS = [
  /\bwhen\s+you\s+(?:called|went|told|said|met|spoke|visited|sent|wrote|signed|agreed|admitted|confessed|denied)\b/i,
  /\bafter\s+you\s+(?:called|went|told|said|met|spoke|visited|sent|wrote|signed|agreed|admitted|confessed|denied)\b/i,
  /\bbefore\s+you\s+(?:called|went|told|said|met|spoke|visited|sent|wrote|signed|agreed|admitted|confessed|denied)\b/i,
  /\bsince\s+you\s+(?:called|went|told|said|met|spoke|visited|sent|wrote|signed|agreed|admitted|confessed|denied)\b/i,
];

function checkAssumes(
  line: TranscriptLine,
  context: TranscriptLine[]
): HeuristicResult {
  const text = line.text;

  for (const pat of ASSUMES_PATTERNS) {
    const match = text.match(pat);
    if (match) {
      const assumedAction = match[0].toLowerCase();
      const answerLines = context.filter((l) => l.role === "answering");
      const contextText = answerLines.map((l) => l.text.toLowerCase()).join(" ");

      const actionVerb = assumedAction.replace(
        /^(?:when|after|before|since)\s+you\s+/,
        ""
      );
      if (!contextText.includes(actionVerb)) {
        return result(
          true,
          "assumes_facts",
          0.88,
          text,
          "Object to form -- assumes facts not in evidence.",
          "FORM"
        );
      }
    }
  }

  return noFire("assumes_facts");
}

// ── 6. Asked and Answered ──

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const word of a) {
    if (b.has(word)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

function checkAskedAndAnswered(
  line: TranscriptLine,
  context: TranscriptLine[]
): HeuristicResult {
  const currentTokens = tokenize(line.text);
  const priorQuestions = context.filter(
    (l) => l.role === "questioning" && l.seq < line.seq
  );

  for (const prior of priorQuestions) {
    const sim = jaccard(currentTokens, tokenize(prior.text));
    if (sim > 0.7) {
      return result(
        true,
        "asked_and_answered",
        0.78,
        line.text,
        "Object to form -- asked and answered.",
        "FORM"
      );
    }
  }

  return noFire("asked_and_answered");
}

// ── 7. Argumentative ──

const ARGUMENTATIVE_PATTERNS = [
  /\byou\s+(?:expect|want)\s+(?:us|this\s+(?:jury|court))\s+to\s+believe\b/i,
  /\bisn'?t\s+it\s+(?:really|actually|obvious)\b/i,
  /\bhow\s+(?:dare|could)\s+you\b/i,
  /\bcome\s+on\b/i,
  /\bthat'?s\s+(?:ridiculous|absurd|hard\s+to\s+believe)\b/i,
  /\byou(?:'re|\s+are)\s+(?:lying|not\s+being\s+truthful|making\s+this\s+up)\b/i,
];

function checkArgumentative(line: TranscriptLine): HeuristicResult {
  const text = line.text;

  for (const pat of ARGUMENTATIVE_PATTERNS) {
    if (pat.test(text)) {
      return result(
        true,
        "argumentative",
        0.88,
        text,
        "Object to form -- argumentative.",
        "FORM"
      );
    }
  }

  return noFire("argumentative");
}

// ── 8. Foundation ──

const FOUNDATION_PATTERNS = [
  /\bin\s+your\s+(?:expert\s+)?opinion\b/i,
  /\bwould\s+you\s+agree\s+(?:that|with)\b.*\b(?:medical|scientific|technical|engineering)\b/i,
  /\bwhat\s+caused\b/i,
  /\bwhat\s+is\s+the\s+(?:medical|scientific)\s+(?:reason|cause|explanation)\b/i,
];

function checkFoundation(line: TranscriptLine): HeuristicResult {
  const text = line.text;

  for (const pat of FOUNDATION_PATTERNS) {
    if (pat.test(text)) {
      return result(
        true,
        "foundation",
        0.86,
        text,
        "Object to form -- foundation. Witness has not been qualified.",
        "FORM"
      );
    }
  }

  return noFire("foundation");
}

// ── Main ──

export function runHeuristics(
  line: TranscriptLine,
  context: TranscriptLine[]
): HeuristicResult[] {
  if (line.role !== "questioning") return [];

  return runChecks(line, context);
}

const ANSWER_STARTERS =
  /^(?:(?:well|yes|no|yeah|right|correct|I|my|we|he|she|they|it|um|uh|okay|ok)\b)/i;

const FIRST_PERSON_STATEMENT =
  /^(?:I\s+(?:was|am|did|do|have|had|went|saw|called|told|think|believe|remember|don't|didn't|would|could|should|can't|cannot))\b/i;

const QUESTION_STARTERS =
  /^(?:so\s+you(?:'re|\s+are)\s+(?:saying|telling)|so\s+(?:your|the)\s+testimony|isn'?t\s+it|you\s+(?:expect|want)|did\s+you|do\s+you|can\s+you|could\s+you|would\s+you|will\s+you|have\s+you|has\s+|are\s+you|is\s+|were\s+you|was\s+|who\s+|what\s+|where\s+|when\s+|why\s+|how\s+)/i;

function looksLikeAnswer(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.endsWith("?")) return false;
  if (QUESTION_STARTERS.test(trimmed)) return false;
  if (ANSWER_STARTERS.test(trimmed)) return true;
  if (FIRST_PERSON_STATEMENT.test(trimmed)) return true;
  return false;
}

/**
 * Audio mode: run heuristics regardless of role since speaker detection
 * is unreliable on raw audio. The confidence penalty handles false positives.
 * For lines that look like answers, skip privilege checks (witnesses
 * mentioning their own attorney in an answer is not a privilege probe).
 */
export function runHeuristicsAudio(
  line: TranscriptLine,
  context: TranscriptLine[]
): HeuristicResult[] {
  if (line.role === "procedural" || line.role === "objecting") return [];

  if (looksLikeAnswer(line.text)) {
    // Only run form checks (compound, vague, etc.) — skip privilege
    // because answer lines mentioning "my attorney" are not objectionable
    const checks = [
      checkCompound(line),
      checkMischaracterizes(line, context),
      checkVague(line),
      checkAssumes(line, context),
      checkAskedAndAnswered(line, context),
      checkArgumentative(line),
      checkFoundation(line),
    ];
    return checks.filter((r) => r.fired && r.confidence >= CONFIDENCE_FLOOR);
  }

  return runChecks(line, context);
}

function runChecks(
  line: TranscriptLine,
  context: TranscriptLine[]
): HeuristicResult[] {
  const checks = [
    checkPrivilege(line),
    checkCompound(line),
    checkMischaracterizes(line, context),
    checkVague(line),
    checkAssumes(line, context),
    checkAskedAndAnswered(line, context),
    checkArgumentative(line),
    checkFoundation(line),
  ];

  return checks.filter((r) => r.fired && r.confidence >= CONFIDENCE_FLOOR);
}
