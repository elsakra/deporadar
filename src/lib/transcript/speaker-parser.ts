import type { TranscriptLine, TranscriptRole } from "@/types";
import { v4 as uuid } from "uuid";

const LINE_NUM_PREFIX = /^\s*(?:\d{1,6}|\d{5}:\d{2})\s+/;
const PAGE_HEADER = /^\s*Page\s+\d+/i;

const Q_LABEL = /^\s*Q[.:]?\s+/i;
const A_LABEL = /^\s*A[.:]?\s+/i;

const NAMED_SPEAKER =
  /^\s*(?:(?:MR|MS|MRS|ATTORNEY|JUDGE|DR)\.?\s+[\w'-]+|THE\s+(?:WITNESS|COURT\s*REPORTER|VIDEOGRAPHER|COURT)):\s*/i;

const BY_LINE = /^\s*BY\s+(?:MR|MS|MRS)\.?\s+[\w'-]+:\s*/i;

const COLLOQUY_INDENT = /^\s{10,}/;

const OBJECTION_KEYWORDS =
  /\b(?:object(?:ion)?|objecting)\s+(?:to\s+)?(?:form|the\s+form|compound|vague|privilege|foundation|assumes|argumentative|asked\s+and\s+answered|mischaracteriz)/i;
const PRIVILEGE_OBJECTION = /\bprivilege\b/i;

function stripLineNumbers(line: string): string {
  return line.replace(LINE_NUM_PREFIX, "");
}

function isPageHeader(line: string): boolean {
  return PAGE_HEADER.test(line);
}

interface ParsedToken {
  speaker: string;
  text: string;
  role: TranscriptRole;
}

function classifyRole(speaker: string, text: string): TranscriptRole {
  const lower = speaker.toLowerCase();
  if (lower === "q" || lower.startsWith("by ")) return "questioning";
  if (lower === "a" || lower === "the witness") return "answering";
  if (
    lower === "the court reporter" ||
    lower === "the videographer" ||
    lower === "the court"
  )
    return "procedural";

  if (OBJECTION_KEYWORDS.test(text) || PRIVILEGE_OBJECTION.test(text))
    return "objecting";

  return "procedural";
}

function parseSpeakerFromLine(stripped: string): ParsedToken | null {
  let match: RegExpMatchArray | null;

  if ((match = stripped.match(Q_LABEL))) {
    return {
      speaker: "Q",
      text: stripped.slice(match[0].length).trim(),
      role: "questioning",
    };
  }

  if ((match = stripped.match(A_LABEL))) {
    return {
      speaker: "A",
      text: stripped.slice(match[0].length).trim(),
      role: "answering",
    };
  }

  if ((match = stripped.match(BY_LINE))) {
    const name = match[0].replace(/^\s*BY\s+/i, "").replace(/:\s*$/, "").trim();
    return {
      speaker: `BY ${name}`,
      text: "",
      role: "procedural",
    };
  }

  if ((match = stripped.match(NAMED_SPEAKER))) {
    const name = match[0].replace(/:\s*$/, "").trim();
    const rest = stripped.slice(match[0].length).trim();
    const role = classifyRole(name, rest);
    return { speaker: name, text: rest, role };
  }

  return null;
}

export function parseTranscript(rawText: string): TranscriptLine[] {
  const rawLines = rawText.split(/\r?\n/);
  const results: TranscriptLine[] = [];
  let seq = 1;
  let currentSpeaker = "";
  let currentText = "";
  let currentRole: TranscriptRole = "procedural";
  let hasCurrent = false;

  function flush() {
    if (hasCurrent && currentText.trim()) {
      results.push({
        id: uuid(),
        seq: seq++,
        speaker: currentSpeaker,
        text: currentText.trim(),
        role: currentRole,
      });
    }
    hasCurrent = false;
    currentSpeaker = "";
    currentText = "";
    currentRole = "procedural";
  }

  for (const raw of rawLines) {
    if (!raw.trim() || isPageHeader(raw)) continue;

    const stripped = stripLineNumbers(raw);
    if (!stripped.trim()) continue;

    const token = parseSpeakerFromLine(stripped);

    if (token) {
      flush();
      currentSpeaker = token.speaker;
      currentText = token.text;
      currentRole = token.role;
      hasCurrent = true;
    } else if (hasCurrent) {
      currentText += " " + stripped.trim();
    } else {
      // orphan continuation with no prior speaker -- treat as answering
      currentSpeaker = "UNKNOWN";
      currentText = stripped.trim();
      currentRole = "answering";
      hasCurrent = true;
    }
  }

  flush();
  return results;
}
