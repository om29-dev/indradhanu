"""Cleanup duplicate backend folders safely.

This script moves files from duplicate locations into backend/.trash_duplicates
and removes empty directories. Run it from the repository root with Python.
"""
import os
import shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BACKEND = os.path.join(ROOT, 'backend')
TRASH = os.path.join(BACKEND, '.trash_duplicates')
TARGET_DUPLICATES = [
    os.path.join(BACKEND, 'app', 'services'),
    os.path.join(BACKEND, 'app', 'alerting'),
    os.path.join(BACKEND, 'app', 'ingestion')
]

os.makedirs(TRASH, exist_ok=True)

moved = []
for path in TARGET_DUPLICATES:
    if not os.path.exists(path):
        continue
    for root, dirs, files in os.walk(path, topdown=False):
        for f in files:
            src = os.path.join(root, f)
            rel = os.path.relpath(src, BACKEND)
            dst = os.path.join(TRASH, rel.replace(os.sep, '_'))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.move(src, dst)
            moved.append((src, dst))
        # attempt to remove empty dirs
        try:
            if root != path:
                os.rmdir(root)
        except OSError:
            pass
    try:
        os.rmdir(path)
    except OSError:
        pass

print('Moved files:')
for s, d in moved:
    print(f'  {s} -> {d}')
print('Cleanup complete. Check backend/.trash_duplicates for backups.')
