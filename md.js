// Hand-rolled Markdown renderer with HTML-escape-first XSS protection.
// Supports: # headings, **bold**, *italic*, `inline code`,
//           fenced code blocks, [links](url)
// Usage (browser): renderMarkdown(text) -> html string
// Usage (Node):    const renderMarkdown = require('./md.js')

function renderMarkdown(raw) {
  if (!raw) return '';

  function esc(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inlineFormat(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  var lines = raw.split('\n');
  var out = '';
  var i = 0;

  while (i < lines.length) {
    var line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      i++;
      var codeLines = [];
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(esc(lines[i]));
        i++;
      }
      out += '<pre><code>' + codeLines.join('\n') + '</code></pre>\n';
      i++; // skip closing ```
      continue;
    }

    var escaped = esc(line);

    var h2 = escaped.match(/^##\s+(.*)/);
    if (h2) { out += '<h2>' + inlineFormat(h2[1]) + '</h2>\n'; i++; continue; }

    var h1 = escaped.match(/^#\s+(.*)/);
    if (h1) { out += '<h1>' + inlineFormat(h1[1]) + '</h1>\n'; i++; continue; }

    if (escaped.trim() === '') { out += '<br>\n'; i++; continue; }

    out += '<p>' + inlineFormat(escaped) + '</p>\n';
    i++;
  }

  return out;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = renderMarkdown;
}
