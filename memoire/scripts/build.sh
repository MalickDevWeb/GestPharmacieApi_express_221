#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/build"
TEX_FILE="$BUILD_DIR/memoire-gespharmacie.tex"
PDF_FILE="$BUILD_DIR/memoire-gespharmacie.pdf"

mkdir -p "$BUILD_DIR"

cd "$ROOT_DIR"

while IFS= read -r -d '' svg_file; do
  pdf_file="${svg_file%.svg}.pdf"
  rsvg-convert -f pdf -o "$pdf_file" "$svg_file"
done < <(find assets -type f -name '*.svg' -print0)

pandoc \
  "memoire.md" \
  --from markdown+raw_tex+implicit_figures \
  --standalone \
  --toc \
  --number-sections \
  --include-in-header="templates/header.tex" \
  --resource-path="$ROOT_DIR" \
  --output="$TEX_FILE"

perl -0pi -e 's/\\IfFileExists\{bookmark\.sty\}\{\\usepackage\{bookmark\}\}\{\\usepackage\{hyperref\}\}/\\usepackage{hyperref}/' "$TEX_FILE"

pushd "$BUILD_DIR" >/dev/null

rm -f "$PDF_FILE"

rm -f \
  memoire-gespharmacie.aux \
  memoire-gespharmacie.out \
  memoire-gespharmacie.toc \
  memoire-gespharmacie.lof \
  memoire-gespharmacie.lot \
  memoire-gespharmacie.fls \
  memoire-gespharmacie.fdb_latexmk \
  memoire-gespharmacie.log

set +e
pdflatex -interaction=nonstopmode "memoire-gespharmacie.tex"
first_pass_status=$?
pdflatex -interaction=nonstopmode "memoire-gespharmacie.tex"
second_pass_status=$?
set -e

if [[ ! -s "$PDF_FILE" ]]; then
  exit "${second_pass_status:-$first_pass_status}"
fi

if [[ "$first_pass_status" -ne 0 || "$second_pass_status" -ne 0 ]]; then
  printf 'Compilation terminee avec avertissements auxiliaires, mais PDF genere avec succes.\n' >&2
fi

popd >/dev/null

printf 'PDF genere: %s\n' "$PDF_FILE"
