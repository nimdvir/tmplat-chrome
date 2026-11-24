#!/usr/bin/env python3
"""Build tmplat import files from templates.json.

Checks every template against the rules tmplat 2.x enforces on import
(src/lib/template/template-transfer.schema.ts), then writes:
  tmplat-import.txt   all templates, base64, ready for Options > Import
  tmplat-test-1.txt   one template only, to test the import path
Run:  python3 build.py
"""
import base64, json, pathlib, re, sys

HERE = pathlib.Path(__file__).parent
MAX_TITLE = 32  # TEMPLATE_TITLE_MAX_LENGTH in tmplat 2.x
SECRETS = ("yourls.auth.password", "yourls.auth.signature", "yourls.auth.username",
           "yourlspassword", "yourlssignature", "yourlsusername")


def utf16_len(s):
    return len(s.encode("utf-16-le")) // 2  # JavaScript string length


def check(doc):
    errors, seen = [], set()
    if doc.get("version") != 1:
        errors.append("version must be the number 1")
    for i, t in enumerate(doc["templates"]):
        title = t.get("title", "")
        where = f"#{i + 1} {title!r}"
        if set(t) - {"content", "description", "enabled", "shortcut", "title"}:
            errors.append(f"{where}: unexpected keys {set(t) - {'content','description','enabled','shortcut','title'}}")
        if not 1 <= utf16_len(title) <= MAX_TITLE:
            errors.append(f"{where}: title is {utf16_len(title)} chars (max {MAX_TITLE})")
        if title in seen:
            errors.append(f"{where}: duplicate title")
        seen.add(title)
        if not isinstance(t.get("enabled"), bool):
            errors.append(f"{where}: enabled must be true/false")
        if not isinstance(t.get("content"), str) or not t["content"]:
            errors.append(f"{where}: content must be non-empty text")
        sc = t.get("shortcut")
        if sc is not None and not re.fullmatch(r"[A-Z0-9]", sc):
            errors.append(f"{where}: shortcut must be one letter or digit")
        if any(s in t["content"].lower() for s in SECRETS):
            errors.append(f"{where}: references a YOURLS secret")
    return errors


def encode(doc):
    # Same layout tmplat's own export uses: JSON.stringify(doc, null, 2) -> UTF-8 -> base64
    return base64.b64encode(json.dumps(doc, ensure_ascii=False, indent=2).encode("utf-8")).decode("ascii")


def main():
    doc = json.loads((HERE / "templates.json").read_text("utf-8"))
    errors = check(doc)
    if errors:
        print("\n".join(errors))
        sys.exit(1)
    (HERE / "tmplat-import.txt").write_text(encode(doc) + "\n", "ascii")
    test = {"templates": [t for t in doc["templates"] if t["title"] == "Link · URL"], "version": 1}
    (HERE / "tmplat-test-1.txt").write_text(encode(test) + "\n", "ascii")
    print(f"OK: {len(doc['templates'])} templates -> tmplat-import.txt (+ tmplat-test-1.txt)")


if __name__ == "__main__":
    main()
