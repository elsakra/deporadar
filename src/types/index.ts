import { z } from "zod/v4";

// ─── Transcript ───

export const TranscriptRoleSchema = z.enum([
  "questioning",
  "answering",
  "objecting",
  "procedural",
]);
export type TranscriptRole = z.infer<typeof TranscriptRoleSchema>;

export interface TranscriptLine {
  id: string;
  seq: number;
  speaker: string;
  text: string;
  role: TranscriptRole;
  timestamp?: string;
}

// ─── Radar ───

export const RadarCategorySchema = z.enum(["FORM", "PRIVILEGE", "CLARIFY"]);
export type RadarCategory = z.infer<typeof RadarCategorySchema>;

export const RadarSubtypeSchema = z.enum([
  "compound",
  "vague",
  "assumes_facts",
  "mischaracterizes",
  "argumentative",
  "asked_and_answered",
  "foundation",
  "privilege_probe",
  "work_product_probe",
  "clarify",
]);
export type RadarSubtype = z.infer<typeof RadarSubtypeSchema>;

export const RadarSuggestionSchema = z.object({
  id: z.string(),
  lineSeq: z.number(),
  category: RadarCategorySchema,
  subtype: RadarSubtypeSchema,
  confidence: z.number().min(0).max(1),
  suggestedText: z.string(),
  rationale: z.string(),
  excerpt: z.string(),
  dismissed: z.boolean().optional(),
  alreadyObjected: z.boolean().optional(),
  source: z.enum(["heuristic", "llm", "demo"]).optional(),
});
export type RadarSuggestion = z.infer<typeof RadarSuggestionSchema>;

export const AnalyzeRequestSchema = z.object({
  sessionId: z.string(),
  lines: z.array(
    z.object({
      seq: z.number(),
      speaker: z.string(),
      text: z.string(),
      role: TranscriptRoleSchema,
    })
  ),
  context: z.array(
    z.object({
      seq: z.number(),
      speaker: z.string(),
      text: z.string(),
      role: TranscriptRoleSchema,
    })
  ),
  inputSource: z.enum(["text", "audio"]).default("text"),
});
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const AnalyzeResponseSchema = z.object({
  suggestions: z.array(RadarSuggestionSchema),
  cleanSegment: z.boolean(),
});
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

// ─── LLM Refiner ───

export const LLMRefinerOutputSchema = z.object({
  shouldSurface: z.boolean(),
  adjustedConfidence: z.number().min(0).max(1).optional(),
  refinedSuggestedText: z.string().optional(),
  rationale: z.string(),
});
export type LLMRefinerOutput = z.infer<typeof LLMRefinerOutputSchema>;

// ─── Heuristic Result ───

export interface HeuristicResult {
  fired: boolean;
  subtype: RadarSubtype;
  confidence: number;
  excerpt: string;
  suggestedText: string;
  category: RadarCategory;
}

// ─── Session ───

export type SessionMode = "text" | "audio";
export type SessionStatus = "active" | "ended";

export interface Session {
  id: string;
  user_id: string;
  title: string;
  matter?: string;
  deponent?: string;
  mode: SessionMode;
  started_at: string;
  ended_at?: string;
  notes?: string;
  digest_json?: DigestData;
  digest_markdown?: string;
  created_at: string;
}

// ─── Bookmark ───

export const BookmarkTagSchema = z.enum([
  "admission",
  "impeachment",
  "follow_up",
  "damages",
  "credibility",
  "exhibit",
  "privilege",
  "other",
]);
export type BookmarkTag = z.infer<typeof BookmarkTagSchema>;

export interface Bookmark {
  id: string;
  session_id: string;
  tag: BookmarkTag;
  note?: string;
  transcript_line_id?: string;
  excerpt_text?: string;
  created_at: string;
}

// ─── Digest ───

export interface DigestSection {
  title: string;
  items: { text: string; lineRef?: number }[];
}

export interface DigestData {
  sections: DigestSection[];
  generatedAt: string;
  lineCount: number;
  suggestionCount: number;
}

// ─── Profile ───

export type SubscriptionStatus = "free" | "pro" | "team";

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  firm_name?: string;
  stripe_customer_id?: string;
  subscription_status: SubscriptionStatus;
  plan_type: string;
  session_count: number;
  attorney_affirmed: boolean;
  created_at: string;
}

// ─── Constants ───

export const FREE_SESSION_LIMIT = 2;

export const CONFIDENCE_FLOOR = 0.75;
export const AUDIO_CONFIDENCE_PENALTY = 0.1;
export const AUDIO_CONFIDENCE_FLOOR = 0.85;

export const BOOKMARK_TAGS: { value: BookmarkTag; label: string }[] = [
  { value: "admission", label: "Admission" },
  { value: "impeachment", label: "Impeachment" },
  { value: "follow_up", label: "Follow-up" },
  { value: "damages", label: "Damages" },
  { value: "credibility", label: "Credibility" },
  { value: "exhibit", label: "Exhibit" },
  { value: "privilege", label: "Privilege" },
  { value: "other", label: "Other" },
];

export const RADAR_CATEGORY_CONFIG: Record<
  RadarCategory,
  { label: string; color: string; bgColor: string }
> = {
  FORM: {
    label: "FORM",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  PRIVILEGE: {
    label: "PRIVILEGE",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  CLARIFY: {
    label: "CLARIFY",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
};
