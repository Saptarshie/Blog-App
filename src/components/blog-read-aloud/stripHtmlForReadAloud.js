// client-side utility: lib/stripHtmlForReadAloud.js
export function stripHtmlForReadAloud(html = '') {
  if (typeof html !== 'string' || html.trim() === '') return '';

  // Parse HTML in browser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script/style/noscript - we don't want their text
  doc.querySelectorAll('script, style, noscript').forEach(n => n.remove());

  // Block-level tags we want to treat as paragraph breaks
  const blockTags = new Set([
    'p','div','section','article',
    'header','footer','aside',
    'h1','h2','h3','h4','h5','h6',
    'li','ul','ol','blockquote','pre'
  ]);

  // Walk the DOM and build a readable plain-text string
  function walk(node) {
    let out = '';

    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        // textContent here is already entity-decoded
        out += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();

        if (tag === 'br') {
          out += '\n';
        } else if (tag === 'img') {
          // Include alt/title if present so read-aloud can describe images
          const alt = (child.getAttribute('alt') || child.getAttribute('title') || '').trim();
          if (alt) out += alt + ' ';
        } else if (tag === 'a') {
          // Keep link text, ignore raw href (keeps read-aloud natural)
          out += walk(child);
        } else if (blockTags.has(tag)) {
          const inner = walk(child).trim();
          if (inner) {
            // Add separation for readability
            out += inner + '\n\n';
          }
        } else {
          // Inline or unknown element — include its children text
          out += walk(child);
        }
      }
    });

    return out;
  }

  // Start from body (if empty fallback to using the document element)
  const body = doc.body || doc.documentElement;
  let text = walk(body);

  // Normalize whitespace:
  // - collapse multiple spaces into one
  // - collapse more than two newlines into two
  text = text
    .replace(/\r/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .trim();

  return text;
}
