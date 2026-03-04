import type { DigestData } from "@/types";

export const DEMO_DIGEST: DigestData = {
  generatedAt: new Date().toISOString(),
  lineCount: 60,
  suggestionCount: 6,
  sections: [
    {
      title: "KEY ADMISSIONS",
      items: [
        {
          text: 'Witness confirmed clocking in at 9:15 PM for the night shift, establishing his presence at the time of the incident.',
          lineRef: 12,
        },
        {
          text: 'Witness acknowledged receiving safety training on press equipment but stated "I don\'t remember all the specifics," potentially undermining an inadequate-training theory.',
          lineRef: 16,
        },
        {
          text: "Witness confirmed a permanent partial impairment -- cannot grip heavy tools. Supports future damages claim.",
          lineRef: 60,
        },
        {
          text: 'Workers\' compensation claim was "resolved" with benefits received. Need to verify offset and lien amounts.',
          lineRef: 54,
        },
      ],
    },
    {
      title: "PRIVILEGE RISKS",
      items: [
        {
          text: 'Defense counsel directly probed attorney-client communications: "did you discuss the accident with your attorney." Objection required -- privilege waiver risk if answered.',
          lineRef: 21,
        },
        {
          text: 'Defense counsel probed attorney work product: "did your attorney show you any documents or photographs to prepare." Objection required -- work product doctrine protects materials selected by counsel.',
          lineRef: 49,
        },
      ],
    },
    {
      title: "IMPEACHMENT OPPORTUNITIES",
      items: [
        {
          text: 'Defense counsel attempted to mischaracterize testimony regarding pre-existing pain. Witness said "occasional soreness" (line 20); counsel stated "never experienced any pain at all" (line 33). Witness corrected on the record.',
          lineRef: 33,
        },
        {
          text: "Defense counsel incorrectly assumed witness called 911 from the break room (line 55). Prior testimony established Danny Martinez called from the floor (line 24). Possible foundation for impeaching counsel's preparation quality.",
          lineRef: 55,
        },
      ],
    },
    {
      title: "RECOMMENDED FOLLOW-UPS",
      items: [
        {
          text: "Clarify witness's relationship with co-worker Danny Martinez -- referenced as friend (line 40) and key witness (line 24). May need to address potential bias argument.",
          lineRef: 40,
        },
        {
          text: "Pin down pay reduction details: witness mentioned reduced pay on modified duty (line 48) but no specific dollar amounts established. Quantify for damages calculation.",
          lineRef: 48,
        },
        {
          text: "Obtain Dr. Patel's permanent impairment rating documentation. Witness referenced it (line 60) but specific percentage not established on the record.",
          lineRef: 60,
        },
      ],
    },
  ],
};
