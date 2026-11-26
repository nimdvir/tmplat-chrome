// Builds the bookmarklets: minifies each *.js here into a javascript: link and writes install.html.
// Run: node build.mjs   (needs network once for npx esbuild)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const items = [
  { file: 'copy-with-styles.js', name: 'Copy with styles', about: 'Select part of a page, click it, and paste the HTML with its exact styles. Rich-text apps (Gmail, Docs) get it formatted; code editors get the HTML source.' },
  { file: 'short-link-named.js', name: 'Short link (name it)', about: 'Asks what to call the short link, then opens your dr.nimdvir.com admin page with it filled in. Click Create and "Title - link" is copied.' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
let rows = '';
for (const item of items) {
  const min = execFileSync('npx', ['--yes', 'esbuild@0.25.12', '--minify', '--log-level=error', item.file], { encoding: 'utf8' }).trim();
  item.href = 'javascript:' + encodeURIComponent(min);
  writeFileSync(item.file.replace(/\.js$/, '.bookmarklet.txt'), item.href + '\n');
  rows += `<section><a class="bm" href="${esc(item.href)}">${esc(item.name)}</a><p>${esc(item.about)}</p>` +
    `<details><summary>Or copy the code</summary><textarea readonly rows="4">${esc(item.href)}</textarea></details></section>\n`;
}

writeFileSync('install.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Install bookmarklets</title>
<style>
body{font:16px/1.5 system-ui,sans-serif;max-width:680px;margin:40px auto;padding:0 16px;color:#222}
.bm{display:inline-block;padding:8px 14px;border-radius:8px;background:#1a73e8;color:#fff;text-decoration:none;font-weight:600;cursor:grab}
section{margin:28px 0;padding-bottom:20px;border-bottom:1px solid #ddd}
textarea{width:100%;font:12px monospace}
ol li{margin:4px 0}
</style></head><body>
<h1>Install bookmarklets</h1>
<ol>
<li>Show the bookmarks bar: <b>Ctrl + Shift + B</b> (Mac: <b>Cmd + Shift + B</b>).</li>
<li><b>Drag</b> a blue button below onto the bookmarks bar.</li>
<li>If dragging doesn't work: right-click the bar &rsaquo; <b>Add page…</b>, name it, and paste the code from "Or copy the code" as the URL.</li>
</ol>
${rows}</body></html>
`);
console.log('Built', items.map((i) => i.name).join(', '));
