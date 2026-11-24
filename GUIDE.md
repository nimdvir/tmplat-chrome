# tmplat guide (unified)

One place for everything about tmplat: how to use it, how to manage my templates, how to write new ones, and the full list of values you can use.

This guide is for **tmplat 2.x**, the version installed in Chrome (extension ID `dcjnfaoifoefmnbhhlbppaebgnccfddf`). It combines the guide built into the extension with the older guide from tmplat.com. Where the old 1.x behaviour differs, it says so.

**Contents**

1. [What tmplat does](#1-what-tmplat-does)
2. [Running a template](#2-running-a-template)
3. [Managing my templates](#3-managing-my-templates)
4. [My template set](#4-my-template-set)
5. [Writing templates](#5-writing-templates)
6. [Gotchas and limits](#6-gotchas-and-limits)
7. [Reference: standard values](#7-reference-standard-values)
8. [Reference: lists and objects](#8-reference-lists-and-objects)
9. [Reference: operations](#9-reference-operations)
10. [Reference: options](#10-reference-options)
11. [Deprecated names](#11-deprecated-names)
12. [What changed from 1.x](#12-what-changed-from-1x)
13. [About this repo and tmplat.com](#13-about-this-repo-and-tmplatcom)
14. [Bookmarklets](#14-bookmarklets)

---

## 1. What tmplat does

tmplat copies information about the current web page to the clipboard. A template is a piece of text with placeholders in curly braces. When you run it, each placeholder is replaced with a value from the page.

```text
[{title}]({url})
```

becomes

```text
[Example & Domain](https://example.com/docs/intro)
```

The result is always **plain text**. tmplat does not copy rich text, so HTML or Markdown is pasted as the raw code.

---

## 2. Running a template

There are three ways to run a template.

| Way | How | Setting |
|---|---|---|
| **Toolbar popup** | Click the tmplat icon, then click a template. | Options › Settings. The button can open the popup or run one chosen template. |
| **Right-click menu** | Right-click the page, choose tmplat, then a template. | Can list every template or run one chosen template. Can auto-paste. |
| **Keyboard shortcut** | Give a template a one-character shortcut (A–Z or 0–9). Then press **Ctrl + Alt + key** (Windows/Linux) or **Shift + Option + key** (Mac) on the page. | Shortcuts must be switched on in settings. Can auto-paste. |

Only **enabled** templates appear in the popup, the menu and shortcuts. Disabled ones stay in the options table but are hidden everywhere else.

**URL shortener.** Anything using `{#shorten}…{/shorten}` uses the shortener picked in settings: da.gd, spoo.me or your own YOURLS server.

My own shortener (`d.nimdvir.com`) speaks the YOURLS language. To use it, go to Options › Settings › URL shorteners and set:

- **Service:** YOURLS
- **URL:** `https://d.nimdvir.com/api/yourls`
- **Authentication:** signature token, using the admin passcode

Short links then look like `d.nimdvir.com/bitm-330-syllabus`, with the name taken from the page address. The same page always gets the same link, and these links show as **tmplat** in the admin page. If the admin passcode changes, update it here too. To choose the name yourself, use the **Short link (name it)** bookmarklet (section 14).

---

## 3. Managing my templates

My templates live in [`my-templates/`](my-templates/):

| File | What it is |
|---|---|
| `templates.json` | The readable master copy. Edit this one. |
| `build.py` | Checks `templates.json` against tmplat's import rules and writes the two files below. |
| `tmplat-import.txt` | All templates, base64-encoded, ready to import. |
| `tmplat-test-1.txt` | One template only (`Link · URL`), to test the import path. |

### Why my earlier import failed

tmplat 2.x rejects a whole import file if **any** template title is longer than **32 characters**. The old cleaned file had four titles over the limit (for example `Selection · Markdown + Source + Date` is 36). One bad title rejected all 39, with the message "not in a supported format". The JSON and base64 were fine.

### Import rules (from tmplat's source code)

A file is accepted only if all of these hold:

- It is base64 of UTF-8 JSON, or plain JSON. Spaces and line breaks in the base64 are ignored.
- The top level is `{"templates": [...], "version": 1}`. `version` must be the **number** 1, not `"1"`. A bare `[...]` list of templates is also accepted.
- There is at least one template.
- Each template has `title` (1–32 characters), `content` (text), `enabled` (`true`/`false`), and optionally `description` and `shortcut`.
- `shortcut` is one letter or digit, or `null`. Anything else is quietly dropped, not rejected.
- Import **always adds**. It never overwrites or merges. Importing twice gives duplicates.

### Step by step: replace my templates with the clean set

1. **Back up.** Open Options (right-click the tmplat icon › Options). Tick the select-all box, then choose **Export** and save the text.
2. **(Optional) test the path.** Click **Import**, open `tmplat-test-1.txt`, copy all its text, paste it into the **Templates** box, then click **Read**. If one template ("Link · URL") is listed, the path works. Cancel, or import it and delete it afterwards.
3. **Delete the old templates.** Tick select-all, then **untick the 7 built-in templates**: `URL`, `Short URL`, `Anchor`, `Encoded`, `BBCode`, `Markdown`, `Selection in Markdown`. Built-ins can't be deleted, and while any are ticked the Delete button stays greyed out. Click **Delete** and confirm. With 55 rows across two pages, do page 1, then page 2.
4. **Import.** Click **Import**, paste the full text of `tmplat-import.txt` into the box (or use **Choose File**), and click **Read**. On the "Select the templates to be imported" screen, select all 44 and click **Import**.
5. **Hide the built-ins.** The clean set has its own copies of the 7 built-ins with tidy names. Select the 7 built-ins and choose **Disable** so they don't show twice in the popup. Optionally use **Bottom** to move them out of the way.

Pasting the text is the safest route. **Choose File** should also work, but pasting removes any doubt about the file.

### Changing templates later

- **Small change:** edit it in the options page directly.
- **Bigger reorganisation:** edit `my-templates/templates.json`, run `python3 my-templates/build.py`, then repeat steps 1–5. The script stops with a clear message if a title is too long, a title is duplicated, or a template mentions a YOURLS secret.
- **Order:** the table's bulk menu has **Top**, **Move up**, **Move down** and **Bottom**. The popup shows templates in table order.

---

## 4. My template set

44 templates, grouped by the prefix in the title. All are enabled except the two marked *off*.

**Link · the current page as a link**

| Title | Output |
|---|---|
| Link · URL | The URL |
| Link · Short URL | Shortened URL |
| Link · Title \| URL | `Title \| https://…` |
| Link · Title + URL (Markdown) | `Title - [url](url)` |
| Link · Title + Short URL | `Title - https://short` |
| Link · Markdown | `[Title](url)`, with a hover title if that option is on |
| Link · Markdown (short URL) | `[Title](short url)` |
| Link · Markdown + Date Added | `[Title](url) — added 2026-11-24` **(new)** |
| Link · HTML Anchor | `<a href="…">Title</a>`, follows your link target/title options |
| Link · ChatGPT (VSC + GitHub) | Fixed link to that ChatGPT project chat |
| Link · Encoded URL *(off)* | URL encoded for use inside another URL |
| Link · BBCode *(off)* | `[url=…]Title[/url]` |

**Email · plain text that pastes cleanly into Gmail**

| Title | Output |
|---|---|
| Email · Title + Short URL | Title, then the short link on the next line **(new)** |
| Email · Quote + Source | “Selected text” — Title, URL **(new)** |

**Selection · what you have highlighted**

| Title | Output |
|---|---|
| Selection · Markdown | Selection as Markdown |
| Selection · MD + Source | Selection, then `Source: [Title](url)` |
| Selection · MD + Source + Date | Same, plus `Captured: date` |
| Selection · Markdown Quote | `> selection` and a source link **(new)** |
| Selection · Clean Text | Selection with extra spaces/tabs squeezed out (useful for messy Hebrew/RTL text) **(new)** |
| Selection · HTML | Raw HTML of the selection |
| Selection · HTML + Stylesheets | Selection HTML plus the page's stylesheet URLs |
| Selection · Standalone HTML | A ready-to-save `.html` file: the selection (or the whole page), the page's stylesheets and its `<style>` blocks. Looks about 80% like the original; for exact styles use the **Copy with styles** bookmarklet |
| Selection · Dated File Name | `ch06 main` → `ch06-main-261124` |

**Research and course work**

| Title | Output |
|---|---|
| Research · Capture Note | Markdown note: title, author, dates, URLs, keywords, then the selection (or the whole page if nothing is selected) |
| Research · APA Citation | Best-effort APA web citation. Check the date, which is the page's last-modified date |
| Research · Scholar Search | Google Scholar search URL for the selection, or the page title if nothing is selected **(new)** |
| Course · BITM 330 Note | Markdown note header with course, date and link, plus the selection or an empty Notes list **(new)** |

**Page · the whole page**

| Title | Output |
|---|---|
| Page · Reference | Title, author, description, dates, URL, short URL |
| Page · Metadata (full) | Reference plus keywords, favicon, host, path, query, referrer, charset, locale |
| Page · Article Markdown | Only the first `<article>` or `<main>` as Markdown, without menus and footers |
| Page · Full Markdown | Title, URL, then the whole page as Markdown |
| Page · Plain Text | All the page's text |
| Page · HTML | All the page's HTML |

**Inventory · lists**

| Title | Output |
|---|---|
| Inventory · Link URLs | Every link URL, one per line |
| Inventory · Image URLs | Every image URL, one per line |
| Inventory · Links+Images (URLs) | Both URL lists under headings |
| Inventory · Open Tab URLs | URLs of every tab in this window (titles aren't available) |

**Util and Symbols**

| Title | Output |
|---|---|
| Util · Today's Date | `2026-11-24` |
| Util · URL Shortener Info | Active shortener and its non-secret settings, for troubleshooting |
| Symbols · Stars (inline) | Star glyphs and emoji on two lines |
| Symbols · Stars (one per line) | Same, one per line |
| Symbols · Hero Glyphs | Glyphs with what each evokes, tab-separated |
| Symbols · Circled Letters | Ⓐ–Ⓩ, ⓐ–ⓩ, 🅐–🅩 |
| Symbols · Circled Numbers | ⓪–㊿ and filled versions |

---

## 5. Writing templates

### Tags

`{name}` is replaced by that value. If the value is empty, the tag disappears. It is never left in place.

Tmplat uses **single** curly braces, unlike standard Mustache.

### Escaping

| Write | Result for a title of `Example & Domain` | Use for |
|---|---|---|
| `{title}` | `Example & Domain` | Plain text, Markdown, URLs (the default) |
| `{{title}}` or `{&title}` | `Example &amp; Domain` | Text going inside HTML |

This is the opposite of standard Mustache, which escapes by default. Triple braces `{{{x}}}` do **not** mean "unescaped" here.

### Sections

A section starts with `{#name}` and ends with `{/name}`. What it does depends on the value:

| Value is… | The section… | Example |
|---|---|---|
| true/false, or text | Shows its contents only when the value is true or not empty | `{#author}By {author}{/author}` |
| a list | Repeats once per item. `{.}` is the current item | `{#links}{.}\n{/links}` |
| an object | Shows once, with the object's properties available by name | `{#options}{templates.links.target}{/options}` |
| an operation | Renders its contents first, then transforms them | `{#upper}{title}{/upper}` |

Operations can be nested: `{#encodeUriComponent}{#upper}{title}{/upper}{/encodeUriComponent}`.

Some operations take literal text as their input: `{#searchParam}q{/searchParam}`, `{#meta}og:image{/meta}`, `{#select}h1{/select}`, `{#dateTime}yyyy-MM-dd{/dateTime}`.

### Inverted sections (fallbacks)

`{^name}…{/name}` shows its contents only when the value is missing, false, empty text or an empty list:

```text
{#selection}{selection}{/selection}{^selection}{title}{/selection}
```

means "the selection if there is one, otherwise the page title".

### Dot notation

`{cookies.session_id}` is the same as `{#cookies}{session_id}{/cookies}`. Dots can go several levels deep: `{options.templates.markdown.inline}`.

### Lists and objects without a section

`{keywords}` with no section gives a comma-separated list (`a,b,c`). Use a section when you need a different separator or layout.

### Comments

`{! anything }` is left out of the output. Use it to annotate long templates.

### Upper and lower case

Names ignore case: `{browserName}`, `{browsername}` and `{BROWSERNAME}` all work. Write the **opening and closing** tag of a section the same way, though. `{#title}…{/TITLE}` is not safe.

### Dates

`dateTime` (now) and `lastModified` (the page's last-modified time) take a [Luxon format](https://moment.github.io/luxon/#/formatting?id=table-of-tokens):

| Token | Gives | | Token | Gives |
|---|---|---|---|---|
| `yyyy` | 2026 | | `HH` | 14 (24-hour) |
| `yy` | 26 | | `mm` | 05 (minutes) |
| `MM` | 11 | | `EEEE` | Tuesday |
| `LLLL` | November | | `dd` | 24 |

Example: `{#dateTime}yyyy-MM-dd HH:mm{/dateTime}` → `2026-11-24 14:05`.

---

## 6. Gotchas and limits

- **Empty output is an error.** If a template produces nothing, for example a Selection template with nothing selected, tmplat shows an error notification instead of copying an empty string.
- **Some pages are off limits.** Values that read the page (title, selection, links and so on) are empty on browser pages such as `chrome://` pages and the Chrome Web Store.
- **No find-and-replace.** There's no regex or replace operation. So tmplat can't put `>` in front of every line, strip hidden right-to-left marks (RLM/LRM), or fix the order of mixed Hebrew/English text. `tidy` only squeezes runs of spaces and tabs and trims the ends.
- **Plain text only.** A template that outputs HTML pastes as code, not as a formatted link. In Gmail, use the `Email ·` templates. Gmail turns bare URLs into links by itself.
- **Titles are limited to 32 characters**, and the import fails if any title is longer.
- **Operations need a closing tag**, even ones with no input: `{#dateTime}{/dateTime}`.
- **Never use the YOURLS secrets** (`options.urlShorteners.yourls.auth.password`, `.signature`, `.username`, or the old `yourlsPassword`, `yourlsSignature`, `yourlsUsername`). Anything referencing them puts the secret on your clipboard. `build.py` refuses them.
- **`selectHtml` and friends return what's *inside* an element, not the element itself.** `{#selectAllHtml}a{/selectAllHtml}` gives the link *text* without the `href`, and `img` gives nothing, because images have no inside. Use `{#links}` and `{#images}` for URLs.
- **Values are only computed when used.** A long template with many values costs nothing for the values it doesn't use.

---

## 7. Reference: standard values

Use these as `{name}`. Aliases (other names that work) are in brackets.

**The URL**

| Name | What it is |
|---|---|
| `url` (`originalUrl`, `originalSource`) | The whole URL |
| `source` | The full, original URL of the page |
| `protocol` | `http`, `https` |
| `host` | `www.example.com` |
| `port` | `80`, `443` |
| `origin` (`base`) | `https://www.example.com:443` |
| `authority` | Username, password and host |
| `userInfo` / `user` / `password` | The login parts of the URL, if any |
| `path` | `/folder/dir/index.html` |
| `directory` | `/folder/dir/` |
| `file` | `index.html` |
| `relative` | Path plus query string |
| `search` (`query`) | The query string: `item=value&item2=value2` |
| `hash` (`anchor`, `fragment`) | Everything after `#` |

**The page**

| Name | What it is |
|---|---|
| `title` (`originalTitle`) | Page title, or the URL if the title isn't loaded yet |
| `author` | Author from the page's meta tags |
| `description` | Description from the page's meta tags |
| `lastModified` | Page's last-modified time (ISO 8601). Also an operation for formatting |
| `characterSet` | `UTF-8` |
| `faviconUrl` (`favicon`) | URL of the page's icon |
| `referrer` | The page you came from, if any |
| `text` | All the page's text |
| `html` | All the page's HTML |
| `markdown` | The whole page converted to Markdown |
| `width` (`pageWidth`) / `height` (`pageHeight`) | Page size |

**Selection and right-clicked link**

| Name | What it is |
|---|---|
| `selection` | Selected text |
| `selectionHtml` | Selected HTML |
| `selectionMarkdown` | Selection converted to Markdown |
| `linkText` / `linkHtml` / `linkMarkdown` | The link you last right-clicked to open the menu |

**Browser, extension and environment**

| Name | What it is |
|---|---|
| `dateTime` | Now, in ISO 8601. Also an operation for formatting |
| `uuid` | A new random unique ID |
| `shorten` (`short`) | The current URL, shortened |
| `browserName` (`browser`) | e.g. Google Chrome |
| `browserFullVersion` (`browserVersion`) / `browserMajorVersion` | Browser version |
| `os` | Operating system |
| `locale` | Language the extension is using |
| `version` | tmplat's version |
| `cookiesEnabled` / `offline` | true/false |
| `screenWidth` / `screenHeight` / `screenColorDepth` (`depth`) | Screen details |
| `templateCount` (`count`) / `templateCustomCount` (`customCount`) | Number of templates / your own templates |

---

## 8. Reference: lists and objects

Use with a section (`{#links}{.}\n{/links}`) or dot notation (`{searchParams.q}`).

| Name | Type | What it is |
|---|---|---|
| `links` | list | URLs of every link on the page |
| `images` | list | URLs of every image on the page |
| `scripts` | list | URLs of every script |
| `styleSheets` | list | URLs of every stylesheet |
| `selectedLinks` (`selectionLinks`) | list | Link URLs inside the selection |
| `selectedImages` | list | Image URLs inside the selection |
| `tabs` | list | URLs of every tab in the current window |
| `keywords` | list | Keywords from the page's meta tags |
| `segments` | list | Parts of the URL path (`/docs/intro` → `docs`, `intro`) |
| `hashSegments` (`fsegments`) | list | Path parts inside the hash |
| `searchParams` (`params`) | object | Query string as name → value |
| `hashSearchParams` (`fparams`) | object | Query string inside the hash |
| `cookies` | object | Cookie name → value for this URL |
| `cookieNames` | list | Cookie names for this URL |
| `coords` | object | Your location (latitude, longitude, accuracy), if available |
| `plugins` | list | Browser plugin names |
| `options` | object | Your tmplat settings (see section 10) |
| `template` | object | The template being run: `template.title`, `.content`, `.description`, `.enabled`, `.id`, `.predefined`, `.shortcut` |

---

## 9. Reference: operations

Use as `{#name}input{/name}`. The input is rendered first, so it can contain other tags.

**Change text**

| Name | Does |
|---|---|
| `upper` / `lower` | ALL CAPS / all lower case |
| `upperCase` / `lowerCase` | Same, treating input as space-separated words |
| `capitalize` (`capitalise`) | First letter upper, rest lower |
| `camelCase` / `kebabCase` / `snakeCase` / `startCase` | `myTitle` / `my-title` / `my_title` / `My Title` |
| `trim` / `trimStart` (`trimLeft`) / `trimEnd` (`trimRight`) | Remove whitespace at both ends / start / end |
| `tidy` | Squeeze runs of spaces and tabs into one space, then trim |
| `deburr` | Remove accents from Latin letters (é → e) |
| `length` / `wordCount` | Number of characters / words |

**Encode and decode**

| Name | Does |
|---|---|
| `encodeUriComponent` (`encode`) | Make text safe inside a URL or query string |
| `decodeUriComponent` (`decode`) | Reverse of the above |
| `escapeHtml` (`escape`) / `unescapeHtml` (`unescape`) | `&` ↔ `&amp;` and so on |
| `encodeBase64` / `decodeBase64` | Base64 |

**Dates**

| Name | Does |
|---|---|
| `dateTime` | Format now: `{#dateTime}yyyy-MM-dd{/dateTime}` |
| `lastModified` | Format the page's last-modified time |

**Read parts of the URL or page**

| Name | Input | Gives |
|---|---|---|
| `searchParam` (`param`) | parameter name | Its value: `{#searchParam}q{/searchParam}` |
| `hashSearchParam` (`fparam`) | parameter name | Its value from inside the hash |
| `segment` / `hashSegment` (`fsegment`) | number | That path part (counting from 0) |
| `image` / `keyword` | number | That image URL / keyword |
| `meta` | meta tag name | e.g. `{#meta}article:published_time{/meta}` |
| `cookie` / `localStorage` / `sessionStorage` | name | That stored value |
| `shorten` (`short`) | a URL | The URL shortened |

**Pick elements from the page (CSS selector or XPath)**

| CSS selector | XPath | Gives |
|---|---|---|
| `select` | `xpath` | Text of the first match |
| `selectAll` | `xpathAll` | Text of every match, one per line |
| `selectHtml` | `xpathHtml` | HTML inside the first match (not its own tag) |
| `selectAllHtml` | `xpathAllHtml` | HTML of every match |
| `selectMarkdown` | `xpathMarkdown` | First match as Markdown |
| `selectAllMarkdown` | `xpathAllMarkdown` | Every match as Markdown |

Example: `{#selectMarkdown}article, main{/selectMarkdown}`.

**URL stack (advanced)**

| Name | Does |
|---|---|
| `pushUrl` | Treat the given URL as the current URL for the URL values that follow |
| `popUrl` | Go back to the previous URL |

---

## 10. Reference: options

Read your settings with `{options.…}`, for example `{#options.templates.links.target} target="_blank"{/options.templates.links.target}`.

| Path | Type | Meaning |
|---|---|---|
| `options.templates.links.target` | true/false | HTML links should open in a new tab |
| `options.templates.links.title` | true/false | Links should include hover text |
| `options.templates.markdown.inline` | true/false | Markdown links inline rather than as references |
| `options.templates.action.mode` | `popup` / `template` | What the toolbar button does |
| `options.templates.action.templateId` | text | Template the toolbar button runs |
| `options.templates.action.popup.autoCloseEnabled` | true/false | Popup closes after running |
| `options.templates.action.popup.optionLinkEnabled` | true/false | Popup shows an Options link |
| `options.templates.contextMenu.enabled` | true/false | Right-click menu is on |
| `options.templates.contextMenu.mode` | `menu` / `template` | List all templates or run one |
| `options.templates.contextMenu.templateId` | text | Template the menu runs |
| `options.templates.contextMenu.autoPasteEnabled` | true/false | Auto-paste after a menu run |
| `options.templates.contextMenu.optionLinkEnabled` | true/false | Menu shows an Options link |
| `options.templates.shortcuts.enabled` | true/false | Keyboard shortcuts are on |
| `options.templates.shortcuts.autoPasteEnabled` | true/false | Auto-paste after a shortcut |
| `options.notifications.enabled` | true/false | Desktop notifications are on |
| `options.notifications.changelog.enabled` | true/false | Show a notification after updates |
| `options.notifications.changelog.scope` | `major` / `minor` / `patch` | Smallest update that triggers it |
| `options.urlShorteners.provider` | `dagd` / `spoome` / `yourls` | Active shortener |
| `options.urlShorteners.yourls.url` | text | Your YOURLS server address |
| `options.urlShorteners.yourls.auth.mode` | `advanced` / `basic` | How YOURLS logs in |
| `options.urlShorteners.yourls.auth.username` / `.password` / `.signature` | text | **Secrets — never use** |

---

## 11. Deprecated names

These still work so old templates don't break, but may be removed. Don't use them in new templates.

- **Settings flags (use `options.…` instead):** `bitly`, `bitlyAccount`, `googl`, `googlAccount` (`googlOAuth`), `yourls`, `yourlsAuthentication`, `yourlsUrl`, `linksTarget` (`anchorTarget`, `doAnchorTarget`), `linksTitle` (`anchorTitle`, `doAnchorTitle`), `markdownInline`, `menu` (`contextMenu`), `menuOptions`, `menuPaste`, `notifications`, `shortcuts`, `shortcutsPaste`, `toolbarClose`, `toolbarKey` (`toolbarFeatureName`), `toolbarOptions`, `toolbarPopup`.
- **Always empty or fixed:** `notificationDuration` (always 0), `toolbarFeature`, `toolbarStyle` (`toolbarFeatureDetails`) (always false), `java`, `popular` (always empty).
- **Replaced:** `encoded` → use `{#encodeUriComponent}{url}{/encodeUriComponent}`.
- **Secrets, never use:** `yourlsPassword`, `yourlsSignature`, `yourlsUsername`.

---

## 12. What changed from 1.x

The old guide on tmplat.com and the code in this repo's `src/` folder describe **1.2.9** (2015). The installed extension is **2.x** (2026). The template syntax is the same. These things changed:

| | 1.x | 2.x |
|---|---|---|
| Import/export format | Plain JSON with a text `version` and extra fields (`key`, `image`, `usage`…) | Base64 of `{"templates":[…],"version":1}` with only `title`, `content`, `description`, `enabled`, `shortcut` |
| Title length | No limit | 32 characters |
| URL shorteners | bit.ly, goo.gl, YOURLS | da.gd, spoo.me, YOURLS |
| Template icons | Each template had an image | No icons; descriptions instead |
| Settings in templates | Flat names like `{linksTarget}` | `{options.templates.links.target}` (old names deprecated) |
| Values | — | Several values were renamed or added. New ones include `uuid`, the case operations (`kebabCase` etc.), `encodeBase64`/`decodeBase64`, and the da.gd/spoo.me shorteners |

---

## 13. About this repo and tmplat.com

This repo, `nimdvir/tmplat-chrome`, is the home for **my templates and this guide**. Its `src/` folder is a copy of the extension's source code frozen at 1.2.9 (2015). You don't need it for the extension to work. Chrome installs tmplat from the Chrome Web Store.

| Where | What it is |
|---|---|
| [tmplat-extension/tmplat](https://github.com/tmplat-extension/tmplat) | The current extension source (2.x, TypeScript). This guide's import rules come from it. |
| [tmplat-extension/tmplat.com](https://github.com/tmplat-extension/tmplat.com) | The source of the website at tmplat.com. |

The older copies under the `nim-dvir` account (`nim-dvir/tmplat`, `nim-dvir/tmplat.com`) are no longer needed and can be archived or deleted.

---

## 14. Bookmarklets

A bookmarklet is a bookmark that runs a little code on the page you're on. These two do things tmplat can't. Their code is in [`bookmarklets/`](bookmarklets/).

**To install:** download [`bookmarklets/install.html`](bookmarklets/install.html), open it in Chrome, and drag each blue button onto the bookmarks bar (show the bar with Ctrl + Shift + B).

| Bookmarklet | What it does |
|---|---|
| **Copy with styles** | Select part of a page and click it. It copies that part with the exact styles the browser applied (colours, fonts, spacing, borders) written into each element. Paste into Gmail, Docs or Word and it looks the same. Paste into a code editor and you get a complete `.html` file. Scripts, classes and page-specific IDs are left out. Links and images keep full addresses. |
| **Short link (name it)** | Asks what to call the short link (it suggests a name from the page title), then opens the `d.nimdvir.com` admin page with the link filled in. Click **Create** and the new short link is copied. The bookmark holds no passcode: if that tab isn't unlocked, the admin page asks for it. These links show as **bookmarklet** in the admin page. |

Limits of **Copy with styles**:

- Hover effects, animations and `::before`/`::after` decorations aren't copied.
- Fonts that the page loads from its own server only appear where that font is installed.
- To change either bookmarklet, edit its `.js` file and run `node build.mjs` in `bookmarklets/`. That rebuilds `install.html`.

