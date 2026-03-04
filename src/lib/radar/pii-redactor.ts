const SSN = /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g;
const EMAIL = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g;
const PHONE = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g;
const DOB = /\b(?:0?[1-9]|1[0-2])[/.-](?:0?[1-9]|[12]\d|3[01])[/.-](?:19|20)\d{2}\b/g;

export function redactPII(text: string): string {
  return text
    .replace(SSN, "[SSN]")
    .replace(EMAIL, "[EMAIL]")
    .replace(PHONE, "[PHONE]")
    .replace(DOB, "[DOB]");
}
