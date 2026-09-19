// PII Masker — strips sensitive data before sending to local LLM
// Masks: email addresses, phone numbers, exact addresses

/**
 * Mask PII in text before LLM processing.
 * Replaces sensitive patterns with generic placeholders.
 */
export function maskPII(text) {
  if (!text || typeof text !== 'string') return text;

  let masked = text;

  // Mask email addresses
  masked = masked.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[EMAIL_REDACTED]'
  );

  // Mask phone numbers (Indian: +91, 10-digit, with optional separators)
  masked = masked.replace(
    /(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g,
    '[PHONE_REDACTED]'
  );

  // Mask international phone patterns
  masked = masked.replace(
    /\+?\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g,
    '[PHONE_REDACTED]'
  );

  // Mask PIN codes (6-digit Indian postal codes)
  masked = masked.replace(
    /\b\d{6}\b/g,
    '[PIN_REDACTED]'
  );

  // Mask Aadhaar-like numbers (12 digits with optional spaces)
  masked = masked.replace(
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    '[ID_REDACTED]'
  );

  return masked;
}

/**
 * Check if text contains potential PII
 */
export function hasPII(text) {
  if (!text) return false;
  const piiPatterns = [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/,
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
  ];
  return piiPatterns.some(p => p.test(text));
}
