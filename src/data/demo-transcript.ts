import type { TranscriptLine } from "@/types";

/**
 * Smith v. Acme Industrial Corp. -- PI case.
 * Defense counsel (Mr. Harrison) deposes the plaintiff (Smith).
 * User is implicitly plaintiff's counsel (defending).
 *
 * ~60 lines covering: prelims, accident, medical, depo prep.
 * 6 deliberately objectionable questions embedded at known positions.
 */
export const DEMO_TRANSCRIPT: TranscriptLine[] = [
  { id: "d-1", seq: 1, speaker: "MR. HARRISON", text: "Good morning, Mr. Smith. You understand you're under oath today?", role: "questioning" },
  { id: "d-2", seq: 2, speaker: "THE WITNESS", text: "Yes, I do.", role: "answering" },
  { id: "d-3", seq: 3, speaker: "MR. HARRISON", text: "And you've been deposed before?", role: "questioning" },
  { id: "d-4", seq: 4, speaker: "THE WITNESS", text: "No, this is my first time.", role: "answering" },
  { id: "d-5", seq: 5, speaker: "MR. HARRISON", text: "How long have you been employed at the Acme Industrial facility on Route 9?", role: "questioning" },
  { id: "d-6", seq: 6, speaker: "THE WITNESS", text: "About four years. I started in March of 2022.", role: "answering" },
  { id: "d-7", seq: 7, speaker: "MR. HARRISON", text: "And what is your current job title?", role: "questioning" },
  { id: "d-8", seq: 8, speaker: "THE WITNESS", text: "Equipment operator, level two.", role: "answering" },
  // ── ALERT 1: Compound (seq 9) ──
  { id: "d-9", seq: 9, speaker: "MR. HARRISON", text: "Can you describe what happened on the night of March 15th and also tell us about any conversations you had with your supervisor the following week?", role: "questioning" },
  { id: "d-10", seq: 10, speaker: "THE WITNESS", text: "Well, on March 15th I was operating the press on line four. There was a loud pop and the guard came off. As for my supervisor, I spoke to Mr. Reeves the next Monday.", role: "answering" },
  { id: "d-11", seq: 11, speaker: "MR. HARRISON", text: "What time did your shift start that evening?", role: "questioning" },
  { id: "d-12", seq: 12, speaker: "THE WITNESS", text: "I clocked in at 9:15 PM for the night shift.", role: "answering" },
  { id: "d-13", seq: 13, speaker: "MR. HARRISON", text: "Was anyone else working on line four with you?", role: "questioning" },
  { id: "d-14", seq: 14, speaker: "THE WITNESS", text: "Yes, my co-worker Danny Martinez was on the other end.", role: "answering" },
  { id: "d-15", seq: 15, speaker: "MR. HARRISON", text: "Did you receive safety training on the press equipment when you were first hired?", role: "questioning" },
  { id: "d-16", seq: 16, speaker: "THE WITNESS", text: "Yes. There was a two-day training. But I don't remember all the specifics.", role: "answering" },
  { id: "d-17", seq: 17, speaker: "MR. HARRISON", text: "After the guard came off, what did you do?", role: "questioning" },
  { id: "d-18", seq: 18, speaker: "THE WITNESS", text: "I tried to hit the emergency stop, but my hand got caught. I felt a sharp pain in my right hand and wrist.", role: "answering" },
  { id: "d-19", seq: 19, speaker: "MR. HARRISON", text: "Had you ever experienced any pain in your right hand or wrist before the accident?", role: "questioning" },
  { id: "d-20", seq: 20, speaker: "THE WITNESS", text: "I had occasional soreness from the repetitive work, but nothing serious. Maybe once or twice a month.", role: "answering" },
  // ── ALERT 2: Privilege probe (seq 21) ──
  { id: "d-21", seq: 21, speaker: "MR. HARRISON", text: "Before today's deposition, did you discuss the accident with your attorney?", role: "questioning" },
  { id: "d-22", seq: 22, speaker: "THE WITNESS", text: "I --", role: "answering" },
  { id: "d-23", seq: 23, speaker: "MR. HARRISON", text: "Who transported you to the hospital that night?", role: "questioning" },
  { id: "d-24", seq: 24, speaker: "THE WITNESS", text: "Danny called 911 from the floor. The ambulance took me to Riverside General.", role: "answering" },
  { id: "d-25", seq: 25, speaker: "MR. HARRISON", text: "How long were you at the hospital?", role: "questioning" },
  { id: "d-26", seq: 26, speaker: "THE WITNESS", text: "They kept me overnight. I was discharged the next afternoon.", role: "answering" },
  { id: "d-27", seq: 27, speaker: "MR. HARRISON", text: "What treatment did you receive?", role: "questioning" },
  { id: "d-28", seq: 28, speaker: "THE WITNESS", text: "X-rays, a splint on my wrist, and they gave me pain medication. They referred me to an orthopedic surgeon.", role: "answering" },
  { id: "d-29", seq: 29, speaker: "MR. HARRISON", text: "Did you follow up with the orthopedic surgeon?", role: "questioning" },
  { id: "d-30", seq: 30, speaker: "THE WITNESS", text: "Yes. Dr. Patel at Riverside Orthopedics. I saw her about a week later.", role: "answering" },
  { id: "d-31", seq: 31, speaker: "MR. HARRISON", text: "What did Dr. Patel recommend?", role: "questioning" },
  { id: "d-32", seq: 32, speaker: "THE WITNESS", text: "She said I had a fracture in two of my metacarpal bones and a torn ligament. She recommended surgery.", role: "answering" },
  // ── ALERT 3: Mischaracterization (seq 33) ──
  { id: "d-33", seq: 33, speaker: "MR. HARRISON", text: "So you're saying you never experienced any pain at all in your hand before the accident, is that right?", role: "questioning" },
  { id: "d-34", seq: 34, speaker: "THE WITNESS", text: "No, that's not what I said. I said I had occasional soreness from the work.", role: "answering" },
  { id: "d-35", seq: 35, speaker: "MR. HARRISON", text: "How many days of work did you miss after the accident?", role: "questioning" },
  { id: "d-36", seq: 36, speaker: "THE WITNESS", text: "I was out for about three months. I went back on modified duty in June.", role: "answering" },
  { id: "d-37", seq: 37, speaker: "MR. HARRISON", text: "Were you able to perform all of your previous job duties when you returned?", role: "questioning" },
  { id: "d-38", seq: 38, speaker: "THE WITNESS", text: "No. I couldn't operate the press. They had me doing paperwork and inventory.", role: "answering" },
  { id: "d-39", seq: 39, speaker: "MR. HARRISON", text: "What is your relationship with Danny Martinez outside of work?", role: "questioning" },
  { id: "d-40", seq: 40, speaker: "THE WITNESS", text: "We're friends. We go fishing sometimes on weekends.", role: "answering" },
  // ── ALERT 4: Vague (seq 41) ──
  { id: "d-41", seq: 41, speaker: "MR. HARRISON", text: "Can you tell me about, you know, the general situation and things like that after you left the hospital?", role: "questioning" },
  { id: "d-42", seq: 42, speaker: "THE WITNESS", text: "I was in a lot of pain. I couldn't sleep well. I was worried about money because I was out of work.", role: "answering" },
  { id: "d-43", seq: 43, speaker: "MR. HARRISON", text: "Have you seen any other doctors besides Dr. Patel?", role: "questioning" },
  { id: "d-44", seq: 44, speaker: "THE WITNESS", text: "Yes. My primary care doctor, Dr. Kim, and a physical therapist.", role: "answering" },
  { id: "d-45", seq: 45, speaker: "MR. HARRISON", text: "Are you currently taking any medication for the injury?", role: "questioning" },
  { id: "d-46", seq: 46, speaker: "THE WITNESS", text: "Just ibuprofen now. I was on prescription painkillers for the first two months.", role: "answering" },
  { id: "d-47", seq: 47, speaker: "MR. HARRISON", text: "Did Acme Industrial offer you any accommodation when you returned to work?", role: "questioning" },
  { id: "d-48", seq: 48, speaker: "THE WITNESS", text: "They moved me to the office, like I said. But my pay was reduced because I wasn't on the floor.", role: "answering" },
  // ── ALERT 5: Work product probe (seq 49) ──
  { id: "d-49", seq: 49, speaker: "MR. HARRISON", text: "Did your attorney show you any documents or photographs to prepare for your testimony today?", role: "questioning" },
  { id: "d-50", seq: 50, speaker: "THE WITNESS", text: "I --", role: "answering" },
  { id: "d-51", seq: 51, speaker: "MR. HARRISON", text: "Have you filed any workers' compensation claims related to this injury?", role: "questioning" },
  { id: "d-52", seq: 52, speaker: "THE WITNESS", text: "Yes. I filed a claim through Acme's insurance.", role: "answering" },
  { id: "d-53", seq: 53, speaker: "MR. HARRISON", text: "Is that claim still pending?", role: "questioning" },
  { id: "d-54", seq: 54, speaker: "THE WITNESS", text: "No, it was resolved. I received some benefits for the time I was out.", role: "answering" },
  // ── ALERT 6: Assumes facts (seq 55) ──
  { id: "d-55", seq: 55, speaker: "MR. HARRISON", text: "When you called 911 from the break room, how long did it take for the ambulance to arrive?", role: "questioning" },
  { id: "d-56", seq: 56, speaker: "THE WITNESS", text: "I didn't call 911. Danny did. And he called from the floor, not the break room.", role: "answering" },
  { id: "d-57", seq: 57, speaker: "MR. HARRISON", text: "My apologies. After the ambulance arrived, were you able to walk to it on your own?", role: "questioning" },
  { id: "d-58", seq: 58, speaker: "THE WITNESS", text: "Yes, it was my hand that was injured, not my legs.", role: "answering" },
  { id: "d-59", seq: 59, speaker: "MR. HARRISON", text: "Mr. Smith, do you have any permanent restrictions as a result of this injury?", role: "questioning" },
  { id: "d-60", seq: 60, speaker: "THE WITNESS", text: "Dr. Patel says I have a permanent partial impairment. I can't grip heavy tools the way I used to.", role: "answering" },
];

/** Lines where radar alerts should fire, mapped to their seq numbers */
export const DEMO_ALERT_LINES = [9, 21, 33, 41, 49, 55] as const;
