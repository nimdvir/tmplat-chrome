// Copy with styles: copies the current selection as HTML with the browser's final (computed)
// styles written onto each element, so it looks the same wherever it is pasted.
// Only styles that differ from a plain element of the same type are kept, to keep it small.
// Rich-text apps (Gmail, Docs, Word) get the formatted version; code editors get the HTML source.
(() => {
  const sel = getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) {
    alert('Copy with styles: select something on the page first.');
    return;
  }
  const range = sel.getRangeAt(0);
  let root = range.commonAncestorContainer;
  if (root.nodeType !== 1) root = root.parentElement;

  // A blank page to read each tag's default styles from.
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden';
  document.body.appendChild(frame);
  const blank = frame.contentDocument;
  blank.open();
  blank.write('<!doctype html><html><head></head><body></body></html>');
  blank.close();
  const defaults = {};
  const defaultsFor = (tag) => {
    if (!defaults[tag]) {
      const el = blank.createElement(tag);
      blank.body.appendChild(el);
      const cs = frame.contentWindow.getComputedStyle(el);
      defaults[tag] = {};
      for (const prop of cs) defaults[tag][prop] = cs.getPropertyValue(prop);
      el.remove();
    }
    return defaults[tag];
  };

  const SKIP = /^(-webkit-|transition|animation|will-change|cursor|caret|pointer-events|user-select|perspective-origin|transform-origin|inline-size|block-size|min-inline|max-inline|min-block|max-block|inset-|padding-inline|padding-block|margin-inline|margin-block|border-inline|border-block|border-start|border-end)/;

  // Elements whose size is part of their content; for everything else a fixed width/height
  // would stop the copy from reflowing where it's pasted.
  const SIZED = /^(img|video|canvas|svg|iframe|input|textarea|select|button|hr)$/;

  const styleOf = (el) => {
    const tag = el.tagName.toLowerCase();
    const cs = getComputedStyle(el);
    const base = defaultsFor(tag);
    const color = cs.getPropertyValue('color');
    const out = [];
    for (const prop of cs) {
      if (SKIP.test(prop)) continue;
      if (!SIZED.test(tag) && /^(width|height)$/.test(prop)) continue;
      const value = cs.getPropertyValue(prop);
      if (value === base[prop]) continue;
      // Colours that just follow the text colour by default (borders, outlines...) add nothing.
      if (prop !== 'color' && /-color$/.test(prop) && value === color && base[prop] === base.color) continue;
      out.push(prop + ':' + value);
    }
    return out.join(';');
  };

  // Clone the selected part of `node`, inlining styles; `inRange` drops what wasn't selected.
  const copy = (node) => {
    if (node.nodeType === 3) {
      const text = node.textContent;
      const start = node === range.startContainer ? range.startOffset : 0;
      const end = node === range.endContainer ? range.endOffset : text.length;
      return document.createTextNode(text.slice(start, end));
    }
    if (node.nodeType !== 1) return null;
    const tag = node.tagName.toLowerCase();
    if (/^(script|noscript|template|style|link|meta)$/.test(tag)) return null;
    const clone = node.cloneNode(false);
    clone.removeAttribute('class');
    clone.removeAttribute('id');
    for (const attr of [...clone.attributes]) if (/^on/i.test(attr.name)) clone.removeAttribute(attr.name);
    if (node.href) clone.setAttribute('href', node.href);
    if (node.src) clone.setAttribute('src', node.src);
    if (node.currentSrc) clone.setAttribute('src', node.currentSrc);
    clone.removeAttribute('srcset');
    const style = styleOf(node);
    if (style) clone.setAttribute('style', style);
    for (const child of node.childNodes) {
      if (!range.intersectsNode(child)) continue;
      const c = copy(child);
      if (c) clone.appendChild(c);
    }
    return clone;
  };

  let result;
  try {
    result = copy(root);
  } finally {
    frame.remove();
  }
  const html = result.outerHTML;
  const page = '<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>' +
    document.title.replace(/[<&]/g, (c) => (c === '<' ? '&lt;' : '&amp;')) + '</title>\n</head>\n<body>\n' +
    '<!-- Copied from ' + location.href.replace(/--/g, '%2D%2D') + ' -->\n' + html + '\n</body>\n</html>\n';

  const done = (how) => {
    const note = document.createElement('div');
    note.textContent = 'Copied with styles (' + Math.round(page.length / 1024) + ' KB)' + how;
    note.style.cssText = 'position:fixed;z-index:2147483647;right:16px;bottom:16px;padding:10px 14px;border-radius:8px;background:#111;color:#fff;font:14px system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.3)';
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 2500);
  };
  const plain = () => navigator.clipboard.writeText(page).then(() => done(' as HTML source'), () => prompt('Copy this HTML:', page));
  if (window.ClipboardItem) {
    navigator.clipboard
      .write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([page], { type: 'text/plain' }) })])
      .then(() => done(''), plain);
  } else {
    plain();
  }
})();
