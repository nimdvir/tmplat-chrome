# My tmplat templates

- `templates.json`: the master copy (46 templates). Edit this.
- `build.py`: checks the rules tmplat enforces on import (titles of 32 characters or fewer, `version` 1, and so on), then writes the files below.
- `tmplat-import.txt`: paste this into tmplat › Options › Import.
- `tmplat-test-1.txt`: a single template, for testing the import.

```bash
python3 build.py
```

Full instructions are in [../GUIDE.md](../GUIDE.md), section 3.
