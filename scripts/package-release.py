"""Package source without excluding nested source data; verify byte-for-byte contents."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('output', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
excluded_roots = {'.git', 'node_modules', 'dist', 'data', '.test-data', 'test-results', 'playwright-report', 'previews'}
excluded_files = {'HANDOFF.md', 'h -u origin HEAD', 'website and tools\uf022'}
files = []
for source in sorted(root.rglob('*')):
    relative = source.relative_to(root)
    if source.is_symlink() or not source.is_file() or relative.parts[0] in excluded_roots or '__pycache__' in relative.parts:
        continue
    if source.name in excluded_files or (source.name.startswith('.env') and source.name != '.env.example') or '.sqlite' in source.name:
        continue
    if source.resolve() == args.output.resolve():
        continue
    files.append((source, relative))
args.output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(args.output, 'w', ZIP_DEFLATED, compresslevel=6) as archive:
    for source, relative in files:
        archive.write(source, str(Path('Khan-Productions') / relative))
with ZipFile(args.output) as archive:
    assert archive.testzip() is None
    assert 'Khan-Productions/src/data/catalogue.json' in archive.namelist()
    for source, relative in files:
        assert archive.read(str(Path('Khan-Productions') / relative)) == source.read_bytes(), relative
print(f'PASS: {len(files)} source/config/asset files packaged and verified, including src/data.')
