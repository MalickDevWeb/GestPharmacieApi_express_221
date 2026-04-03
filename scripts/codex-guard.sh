#!/usr/bin/env bash
set -euo pipefail

BASE_REF="${1:-dev}"
FORCE_LOCAL="${CODEX_GUARD_FORCE_LOCAL:-0}"

log() {
  printf '%s\n' "$*"
}

if ! ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  echo "Le script doit etre lance dans un depot Git." >&2
  exit 1
fi

if ! git rev-parse --verify --quiet "${BASE_REF}^{commit}" >/dev/null; then
  echo "Reference de base introuvable: ${BASE_REF}" >&2
  exit 1
fi

cd "$ROOT"

CURRENT_BRANCH="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || git rev-parse --short HEAD)"
BASE_DIFF="$(git diff --name-only "${BASE_REF}...HEAD" || true)"
STAGED_DIFF="$(git diff --cached --name-only || true)"
WORKTREE_DIFF="$(git diff --name-only || true)"
UNTRACKED_DIFF="$(git ls-files --others --exclude-standard || true)"
CHANGED_FILES="$(
  printf '%s\n%s\n%s\n%s\n' \
    "$BASE_DIFF" \
    "$STAGED_DIFF" \
    "$WORKTREE_DIFF" \
    "$UNTRACKED_DIFF" |
    sed '/^$/d' |
    sort -u
)"

if [ -z "$CHANGED_FILES" ]; then
  echo "Aucun changement detecte par rapport a ${BASE_REF}."
  exit 0
fi

log "Codex guard sur la branche ${CURRENT_BRANCH} (base: ${BASE_REF})"
log "Fichiers modifies :"
printf '%s\n' "$CHANGED_FILES"

has_command() {
  command -v "$1" >/dev/null 2>&1
}

has_package_json() {
  [ -f "$ROOT/package.json" ]
}

has_node_modules() {
  [ -d "$ROOT/node_modules" ]
}

has_npm_script() {
  local script_name="$1"

  [ -f "$ROOT/package.json" ] || return 1

  node -e '
    const pkg = require(process.argv[1]);
    const script = process.argv[2];
    process.exit(pkg.scripts && pkg.scripts[script] ? 0 : 1);
  ' "$ROOT/package.json" "$script_name" >/dev/null 2>&1
}

prepare_runtime_dirs() {
  local source_codex_home

  source_codex_home="${CODEX_HOME:-$HOME/.codex}"
  export CODEX_HOME="$ROOT/.kilo/codex-home"
  export CODEX_GUARD_REPORT_DIR="$ROOT/.kilo/guard-reports"
  mkdir -p "$CODEX_HOME" "$CODEX_GUARD_REPORT_DIR"

  if [ "$source_codex_home" != "$CODEX_HOME" ]; then
    for file in config.toml auth.json models_cache.json; do
      if [ -f "$source_codex_home/$file" ] && ! cmp -s "$source_codex_home/$file" "$CODEX_HOME/$file" 2>/dev/null; then
        cp "$source_codex_home/$file" "$CODEX_HOME/$file"
      fi
    done
  fi
}

run_step() {
  local label="$1"
  shift

  log
  log "[check] $label"
  "$@"
}

run_local_checks() {
  local shell_files
  local status=0

  log
  log "Mode local: execution des controles de secours."

  run_step "git diff --check" git diff --check

  shell_files="$(printf '%s\n' "$CHANGED_FILES" | rg '\.sh$' || true)"
  if [ -n "$shell_files" ]; then
    while IFS= read -r shell_file; do
      [ -n "$shell_file" ] || continue
      run_step "bash -n $shell_file" bash -n "$shell_file"
    done <<EOF
$shell_files
EOF
  fi

  if printf '%s\n' "$CHANGED_FILES" | rg -qx 'package\.json'; then
    run_step "validation package.json" node -e 'JSON.parse(require("fs").readFileSync("package.json", "utf8"));'
  fi

  if has_package_json && has_node_modules; then
    if has_npm_script "prisma:generate" && printf '%s\n' "$CHANGED_FILES" | rg -q '(^prisma/|schema\.prisma|package\.json)'; then
      run_step "npm run prisma:generate" npm run prisma:generate
    fi

    if has_npm_script "build"; then
      run_step "npm run build" npm run build
    fi

    if has_npm_script "test"; then
      run_step "npm run test" npm run test
    fi
  else
    log
    log "[skip] node_modules absent: build/test/prisma non executes."
    status=0
  fi

  log
  log "Controles locaux termines."
  return "$status"
}

PROMPT=$(cat <<EOF
Tu agis comme ingenieur de finition sur ce repository.

Contexte:
- La fonctionnalite courante a ete produite par un autre agent (Kilo Code ou equivalent).
- Tu es le dernier garde-fou.
- Le serveur MCP Neon n'est disponible que pour toi si tu en as besoin.

Mission:
1. Inspecte les changements de la branche ${CURRENT_BRANCH} par rapport a ${BASE_REF}.
2. Verifie la coherence avec l'architecture du repo.
3. Execute les controles necessaires (build, tests, verification Prisma si pertinent).
4. Corrige ce qui doit l'etre pour fiabilite, lisibilite, coherence et bonnes pratiques.
5. N'ajoute pas de refonte inutile. Preserve l'intention de la fonctionnalite.
6. A la fin, donne un resume bref des corrections et des verifications executees.

Fichiers actuellement modifies:
${CHANGED_FILES}
EOF
)

prepare_runtime_dirs

if [ "$FORCE_LOCAL" = "1" ]; then
  run_local_checks
  exit $?
fi

if [ "${CODEX_SANDBOX_NETWORK_DISABLED:-0}" = "1" ]; then
  log
  log "Reseau Codex indisponible dans cet environnement. Bascule sur le mode local."
  run_local_checks
  exit $?
fi

if ! has_command codex; then
  log
  log "codex CLI introuvable. Bascule sur le mode local."
  run_local_checks
  exit $?
fi

set +e
codex exec --ephemeral --full-auto -C "$ROOT" "$PROMPT"
codex_status=$?
set -e

if [ "$codex_status" -eq 0 ]; then
  exit 0
fi

log
log "Codex distant a echoue (exit ${codex_status}). Bascule sur le mode local."
run_local_checks
