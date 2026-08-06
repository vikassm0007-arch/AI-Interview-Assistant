import DOMPurify from 'dompurify';

/**
 * Helper to safely resolve DOMPurify sanitize function across ESM / CommonJS / Node environments
 */
function getPurifyInstance() {
  if (typeof DOMPurify?.sanitize === 'function') {
    return DOMPurify;
  }
  if (DOMPurify?.default && typeof DOMPurify.default.sanitize === 'function') {
    return DOMPurify.default;
  }
  return null;
}

/**
 * Sanitizes arbitrary HTML string inputs using DOMPurify to prevent XSS attacks.
 * @param {string} input - Raw text or HTML input
 * @returns {string} Cleaned sanitized string
 */
export function sanitizeHtml(input) {
  if (typeof input !== 'string') return '';
  const purify = getPurifyInstance();
  if (purify) {
    return purify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
  // Fallback string tag strip if running in headless node without window context
  return input
    .replace(/<script\b[^<]*>(?:[\s\S]*?)<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

/**
 * Sanitizes candidate text inputs (transcripts, job descriptions, resume text)
 * to prevent XSS and mitigate prompt injection attacks before sending to LLMs.
 * @param {string} text - Candidate response or upload text
 * @returns {string} Sanitized string free of script tags and control characters
 */
export function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  
  // 1. Strip script blocks & HTML tags
  let clean = sanitizeHtml(text);
  
  // 2. Remove null bytes and dangerous control characters
  clean = clean.replace(/\0/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

  // 3. Trim whitespace
  return clean.trim();
}

/**
 * Prompt Injection Guard: Escapes delimiter brackets and system instruction keywords
 * to prevent candidate inputs from overriding LLM system instructions.
 * @param {string} input - Candidate transcript text
 * @returns {string} Safe prompt string
 */
export function sanitizeForPrompt(input) {
  if (typeof input !== 'string') return '';

  // 1. Replace prompt delimiter tags first
  let safe = input
    .replace(/<SYSTEM_MESSAGE>/gi, '[SYSTEM_MESSAGE]')
    .replace(/<\/SYSTEM_MESSAGE>/gi, '[/SYSTEM_MESSAGE]')
    .replace(/<USER_REQUEST>/gi, '[USER_REQUEST]')
    .replace(/<\/USER_REQUEST>/gi, '[/USER_REQUEST]')
    .replace(/```/g, "'''");

  // 2. Perform general XSS & control character sanitization
  return sanitizeInput(safe);
}
