import type { RadarSuggestion } from "@/types";

export const DEMO_SUGGESTIONS: RadarSuggestion[] = [
  {
    id: "demo-s1",
    lineSeq: 9,
    category: "FORM",
    subtype: "compound",
    confidence: 0.92,
    suggestedText: "Object to form -- compound.",
    rationale:
      'Two completely distinct inquiries joined by "and also tell us about." The first asks about March 15th events; the second asks about conversations with a supervisor the following week.',
    excerpt:
      "Can you describe what happened on the night of March 15th and also tell us about any conversations you had with your supervisor the following week?",
    source: "demo",
  },
  {
    id: "demo-s2",
    lineSeq: 21,
    category: "PRIVILEGE",
    subtype: "privilege_probe",
    confidence: 0.95,
    suggestedText: "Privilege. Instruct not to answer.",
    rationale:
      "Directly probes attorney-client communications. Any discussion between the witness and counsel regarding the accident is protected by attorney-client privilege.",
    excerpt:
      "Before today's deposition, did you discuss the accident with your attorney?",
    source: "demo",
  },
  {
    id: "demo-s3",
    lineSeq: 33,
    category: "FORM",
    subtype: "mischaracterizes",
    confidence: 0.88,
    suggestedText: "Object to form -- mischaracterizes prior testimony.",
    rationale:
      'Witness testified at line 20 that he had "occasional soreness from the repetitive work." Counsel\'s question states he "never experienced any pain at all," which mischaracterizes the prior testimony.',
    excerpt:
      "So you're saying you never experienced any pain at all in your hand before the accident, is that right?",
    source: "demo",
  },
  {
    id: "demo-s4",
    lineSeq: 41,
    category: "FORM",
    subtype: "vague",
    confidence: 0.85,
    suggestedText: "Object to form -- vague.",
    rationale:
      '"The general situation and things like that" is impermissibly vague. The question fails to identify what specific information is being sought.',
    excerpt:
      "Can you tell me about, you know, the general situation and things like that after you left the hospital?",
    source: "demo",
  },
  {
    id: "demo-s5",
    lineSeq: 49,
    category: "PRIVILEGE",
    subtype: "work_product_probe",
    confidence: 0.93,
    suggestedText: "Privilege. Work product. Instruct not to answer.",
    rationale:
      "Documents and photographs selected by counsel for witness preparation are attorney work product. Their selection reflects counsel's mental impressions and litigation strategy.",
    excerpt:
      "Did your attorney show you any documents or photographs to prepare for your testimony today?",
    source: "demo",
  },
  {
    id: "demo-s6",
    lineSeq: 55,
    category: "FORM",
    subtype: "assumes_facts",
    confidence: 0.82,
    suggestedText: "Object to form -- assumes facts not in evidence.",
    rationale:
      'The question assumes the witness called 911 and did so from the break room. Prior testimony at line 24 established that Danny Martinez called 911 from the floor, not the witness from the break room.',
    excerpt:
      "When you called 911 from the break room, how long did it take for the ambulance to arrive?",
    source: "demo",
  },
];
