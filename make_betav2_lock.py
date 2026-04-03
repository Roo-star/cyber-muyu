# -*- coding: utf-8 -*-
"""Build single-file betav2 LOCKED backup (UTF-8, LF)."""
import pathlib

root = pathlib.Path(__file__).resolve().parent
html = (root / "index.html").read_text(encoding="utf-8")
js = (root / "custom-chants.js").read_text(encoding="utf-8")
marker = '<script src="custom-chants.js"></script>'
if marker not in html:
    raise SystemExit("marker not found in index.html")
inline = "<script>\n" + js.rstrip() + "\n</script>"
out = html.replace(marker, inline, 1)
with open(root / "cyber-muyu-betav2-LOCKED.html", "w", encoding="utf-8", newline="\n") as f:
    f.write(out)
print("OK cyber-muyu-betav2-LOCKED.html lines:", out.count("\n"))
