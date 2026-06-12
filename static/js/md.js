// Inkwell vendored markdown renderer
// Escapes raw HTML first, then converts markdown to HTML.
// Supports: # ## headings, **bold**, *italic*, `inline code`,
//           fenced code blocks (```), and [links](url).

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMarkdown(raw) {
  // Step 1: escape all HTML in the raw input
  var escaped = escapeHtml(raw);

  // Step 2: extract fenced code blocks to protect them
  var codeBlocks = [];
  escaped = escaped.replace(/```([^`]*?)```/gs, function(_, inner) {
    var idx = codeBlocks.length;
    codeBlocks.push('<pre><code>' + inner + '</code></pre>');
    return '\x00CODE' + idx + '\x00';
  });

  // Step 3: process line by line for block-level elements
  var lines = escaped.split('\n');
  var out = [];
  var i = 0;
  while (i < lines.length) {
    var line = lines[i];

    // Headings
    if (/^#{2}\s/.test(line)) {
      out.push('<h2>' + inlineMarkdown(line.replace(/^##\s+/, '')) + '</h2>');
      i++;
      continue;
    }
    if (/^#\s/.test(line)) {
      out.push('<h1>' + inlineMarkdown(line.replace(/^#\s+/, '')) + '</h1>');
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === '' || /^\x00CODE\d+\x00$/.test(line.trim())) {
      if (/^\x00CODE\d+\x00$/.test(line.trim())) {
        var m = line.trim().match(/\x00CODE(\d+)\x00/);
        if (m) out.push(codeBlocks[parseInt(m[1], 10)]);
      } else {
        out.push('');
      }
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-heading, non-blank lines
    var para = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,2}\s/.test(lines[i]) && !/^\x00CODE\d+\x00$/.test(lines[i].trim())) {
      para.push(lines[i]);
      i++;
    }
    if (para.length > 0) {
      out.push('<p>' + inlineMarkdown(para.join(' ')) + '</p>');
    }
  }

  var html = out.join('\n');

  // Restore code blocks
  html = html.replace(/\x00CODE(\d+)\x00/g, function(_, idx) {
    return codeBlocks[parseInt(idx, 10)];
  });

  return html;
}

function inlineMarkdown(str) {
  // inline code (protect first)
  var inlineCodes = [];
  str = str.replace(/`([^`]+)`/g, function(_, inner) {
    var idx = inlineCodes.length;
    inlineCodes.push('<code>' + inner + '</code>');
    return '\x01IC' + idx + '\x01';
  });

  // bold
  str = str.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // italic
  str = str.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // links
  str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, text, href) {
    // href is already html-escaped from the outer escapeHtml pass
    return '<a href="' + href + '">' + text + '</a>';
  });

  // restore inline code
  str = str.replace(/\x01IC(\d+)\x01/g, function(_, idx) {
    return inlineCodes[parseInt(idx, 10)];
  });

  return str;
}
