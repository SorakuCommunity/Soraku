/**
 * lib/sanitize.ts — DOMPurify sanitization wrapper
 * Server-safe via isomorphic-dompurify
 */
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'blockquote',
      'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'img',
      'code', 'pre', 'span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
    FORCE_BODY: true,
  })
}

export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}
