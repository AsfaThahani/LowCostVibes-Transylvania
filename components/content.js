const entities = {
  amp: '&',
  nbsp: ' ',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  rsquo: '’',
  lsquo: '‘',
  ndash: '–',
  mdash: '—'
};

export function plain(value) {
  return String(value ?? '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (all, key) => {
      if (key[0] === '#') {
        const n = key[1].toLowerCase() === 'x'
          ? parseInt(key.slice(2), 16)
          : Number(key.slice(1));

        return n >= 0 && n <= 0x10ffff
          ? String.fromCodePoint(n)
          : '';
      }

      return entities[key.toLowerCase()] ?? all;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

export function items(html) {
  return Array.from(
    String(html ?? '').matchAll(
      /<li\b[^>]*>((?:(?!<li\b|<\/li>)[\s\S])*?)<\/li>/gi
    ),
    m => plain(m[1])
  ).filter(Boolean);
}

export function paragraphs(html) {
  return Array.from(
    String(html ?? '').matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi),
    m => plain(m[1])
  ).filter(Boolean);
}

export const picture = name =>
  '/pictures/' + name.split('/').map(encodeURIComponent).join('/');