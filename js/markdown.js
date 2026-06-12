// Vendored markdown renderer — no CDN, no build tools
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMarkdown(text) {
  if (!text) return '';

  // First escape HTML to prevent XSS
  let escaped = escapeHtml(text);

  // Fenced code blocks first (``` ... ```)
  escaped = escaped.replace(/```([\s\S]*?)```/g, function(m, inner) {
    return '<pre><code>' + inner + '</code></pre>';
  });

  // Headings (must be at start of line)
  escaped = escaped.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  escaped = escaped.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  escaped = escaped.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold before italic
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  escaped = escaped.replace(/`(.+?)`/g, '<code>$1</code>');

  // Links [text](url)
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs — double newlines
  escaped = escaped.replace(/\n\n+/g, '</p><p>');

  return '<p>' + escaped + '</p>';
}
