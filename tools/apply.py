#!/usr/bin/env python3
"""Apply a patch file made of exact-text replacements to files under a base directory.

Format (markers sit on their own lines, text between them is taken literally):
  #FILE relative/path
  #REPLACE
  old text
  #WITH
  new text
  #END
  #NEWFILE relative/path
  full text of the new file
  #END
Every old text must occur exactly once in the original file.
"""
import sys, os

def parse(text):
    lines = text.split("\n")
    i, ops, cur = 0, [], None
    def take(until):
        nonlocal i
        buf = []
        while i < len(lines) and lines[i] not in until:
            buf.append(lines[i]); i += 1
        return "\n".join(buf)
    while i < len(lines):
        line = lines[i]
        if line.startswith("#FILE "):
            cur = line[6:].strip(); i += 1
        elif line == "#REPLACE":
            i += 1; old = take({"#WITH"}); i += 1; new = take({"#END"}); i += 1
            ops.append(("replace", cur, old, new))
        elif line.startswith("#NEWFILE "):
            path = line[9:].strip(); i += 1; body = take({"#END"}); i += 1
            ops.append(("new", path, body, None))
        else:
            i += 1
    return ops

def apply(patch_path, base):
    ops = parse(open(patch_path, encoding="utf-8").read())
    originals, plan, errors = {}, {}, []
    for kind, path, a, b in ops:
        full = os.path.join(base, path)
        if kind == "new":
            os.makedirs(os.path.dirname(full) or ".", exist_ok=True)
            open(full, "w", encoding="utf-8", newline="").write(a)
            continue
        if path not in originals:
            originals[path] = open(full, encoding="utf-8", newline="").read(); plan[path] = []
        text = originals[path]
        n = text.count(a)
        if n != 1:
            errors.append(f"{path}: expected 1 match, found {n} for: {a[:60]!r}")
            continue
        plan[path].append((text.index(a), a, b))
    for path, hunks in plan.items():
        hunks.sort()
        for k in range(1, len(hunks)):
            if hunks[k][0] < hunks[k-1][0] + len(hunks[k-1][1]):
                errors.append(f"{path}: overlapping hunks near {hunks[k][0]}")
    if errors:
        print("\n".join(errors)); return False
    for path, hunks in plan.items():
        text, out, pos = originals[path], [], 0
        for start, old, new in hunks:
            out.append(text[pos:start]); out.append(new); pos = start + len(old)
        out.append(text[pos:])
        open(os.path.join(base, path), "w", encoding="utf-8", newline="").write("".join(out))
    print(f"applied {sum(len(h) for h in plan.values())} replacements in {len(plan)} files")
    return True

if __name__ == "__main__":
    sys.exit(0 if apply(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else ".") else 1)
