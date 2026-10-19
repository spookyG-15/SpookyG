const HEADING = /^(#{2,3})\s+(.+)$/;
const BULLET = /^[-*]\s+(.+)$/;
const LINK = /\[([^\]]+)]\((https:\/\/[^\s)]+)\)/;
const BOLD = /\*\*([^*]+)\*\*/g;
const ITALIC = /(^|[^*])\*([^*\n]+)\*/g;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(
      new RegExp(LINK.source, 'g'),
      '<a class="link" href="$2" rel="noopener noreferrer" target="_blank">$1<span class="sr-only"> (opens in a new tab)</span></a>'
    )
    .replace(BOLD, '<strong>$1</strong>')
    .replace(ITALIC, '$1<em>$2</em>');
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let paragraph: string[] = [];
  let items: string[] = [];

  const flushParagraph = (): void => {
    if (paragraph.length > 0) {
      html.push(`<p>${inline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const flushList = (): void => {
    if (items.length > 0) {
      html.push(`<ul>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
      items = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === '') {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading !== null) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = BULLET.exec(line);
    if (bullet !== null) {
      flushParagraph();
      items.push(bullet[1]);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return html.join('\n');
}
