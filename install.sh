#!/usr/bin/env bash
# batbout installer — macOS / Linux
# Licensed under the Apache License, Version 2.0. See LICENSE.
#
#   curl -fsSL https://raw.githubusercontent.com/Abdullah1x2x/batbout/main/install.sh | bash
#   curl -fsSL .../install.sh | bash -s -- --agent claude-code,cursor
#   curl -fsSL .../install.sh | bash -s -- --all
#
# Options:
#   (none)            install for every agent detected on this machine (+ ~/.agents/skills)
#   --agent a,b,...   install only for these agents (see --list)
#   --all             install for every supported agent, detected or not
#   --project         install into the current project instead of your home folder
#   --link            link to this checkout instead of copying (for developing the skills)
#   --uninstall       remove batbout skills from the selected agents
#   --list            show supported agents and whether they were detected
#   -h, --help        show this help

set -euo pipefail

REPO="${BATBOUT_REPO:-Abdullah1x2x/batbout}"
REF="${BATBOUT_REF:-main}"
SKILLS=(batbout batbout-review batbout-recap)
# The names before the rename to Batbout, removed so they don't run twice
LEGACY=(takemyhand takemyhand-review takemyhand-recap)

# id | global skills dir | project skills dir | detection dir
AGENTS=(
  "claude-code|$HOME/.claude/skills|.claude/skills|$HOME/.claude"
  "codex|$HOME/.agents/skills|.agents/skills|$HOME/.codex"
  "cursor|$HOME/.cursor/skills|.agents/skills|$HOME/.cursor"
  "gemini-cli|$HOME/.gemini/skills|.agents/skills|$HOME/.gemini"
  "github-copilot|$HOME/.copilot/skills|.agents/skills|$HOME/.copilot"
  "opencode|$HOME/.config/opencode/skills|.agents/skills|$HOME/.config/opencode"
  "windsurf|$HOME/.codeium/windsurf/skills|.windsurf/skills|$HOME/.codeium/windsurf"
  "cline|$HOME/.agents/skills|.agents/skills|$HOME/.cline"
  "roo|$HOME/.roo/skills|.roo/skills|$HOME/.roo"
  "kiro-cli|$HOME/.kiro/skills|.kiro/skills|$HOME/.kiro"
  "goose|$HOME/.config/goose/skills|.goose/skills|$HOME/.config/goose"
  "continue|$HOME/.continue/skills|.continue/skills|$HOME/.continue"
  "qwen-code|$HOME/.qwen/skills|.qwen/skills|$HOME/.qwen"
  "trae|$HOME/.trae/skills|.trae/skills|$HOME/.trae"
  "junie|$HOME/.junie/skills|.junie/skills|$HOME/.junie"
  "augment|$HOME/.augment/skills|.augment/skills|$HOME/.augment"
  "amp|$HOME/.config/agents/skills|.agents/skills|$HOME/.config/amp"
  "universal|$HOME/.agents/skills|.agents/skills|"
)

MODE=detected; SELECTED=""; PROJECT=0; UNINSTALL=0; LIST=0; LINK=0

usage() {
  cat <<'EOF'
batbout installer

  install.sh                    install for every agent detected here (+ ~/.agents/skills)
  install.sh --agent a,b,...    install only for these agents (see --list)
  install.sh --all              install for every supported agent
  install.sh --project          install into the current project instead of your home folder
  install.sh --link             link to this checkout instead of copying (run from a clone)
  install.sh --uninstall        remove batbout from the selected agents
  install.sh --list             show supported agents and whether they were detected
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --agent|-a) MODE=selected; SELECTED="${2:-}"; shift $(( $# > 1 ? 2 : 1 )) ;;
    --agent=*)  MODE=selected; SELECTED="${1#*=}"; shift ;;
    --all)      MODE=all; shift ;;
    --project)  PROJECT=1; shift ;;
    --link)     LINK=1; shift ;;
    --uninstall) UNINSTALL=1; shift ;;
    --list)     LIST=1; shift ;;
    -h|--help)  usage; exit 0 ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 1 ;;
  esac
done

field() { echo "$1" | cut -d'|' -f"$2"; }
is_detected() { local d; d="$(field "$1" 4)"; [ -z "$d" ] || [ -d "$d" ]; }

if [ "$LIST" = 1 ]; then
  printf "%-16s %-10s %s\n" AGENT DETECTED "GLOBAL PATH"
  for a in "${AGENTS[@]}"; do
    if is_detected "$a"; then s=yes; else s=-; fi
    printf "%-16s %-10s %s\n" "$(field "$a" 1)" "$s" "$(field "$a" 2)"
  done
  exit 0
fi

# Validate --agent ids
if [ "$MODE" = selected ]; then
  [ -n "$SELECTED" ] || { echo "--agent needs a value, e.g. --agent claude-code,cursor" >&2; exit 1; }
  IFS=',' read -r -a WANT <<< "$SELECTED"
  for w in "${WANT[@]}"; do
    ok=0; for a in "${AGENTS[@]}"; do [ "$(field "$a" 1)" = "$w" ] && ok=1; done
    [ "$ok" = 1 ] || { echo "Unknown agent: $w (see --list)" >&2; exit 1; }
  done
fi

# Pick targets, de-duplicating shared folders
TARGETS=(); LABELS=()
add_target() {
  local i
  for i in "${!TARGETS[@]}"; do
    if [ "${TARGETS[$i]}" = "$1" ]; then LABELS[$i]="${LABELS[$i]}, $2"; return; fi
  done
  TARGETS+=("$1"); LABELS+=("$2")
}
for a in "${AGENTS[@]}"; do
  id="$(field "$a" 1)"
  case "$MODE" in
    all) take=1 ;;
    detected) if is_detected "$a"; then take=1; else take=0; fi ;;
    selected) take=0; for w in "${WANT[@]}"; do [ "$w" = "$id" ] && take=1; done ;;
  esac
  [ "$take" = 1 ] || continue
  if [ "$PROJECT" = 1 ]; then dir="$PWD/$(field "$a" 3)"; else dir="$(field "$a" 2)"; fi
  add_target "$dir" "$id"
done

if [ "${#TARGETS[@]}" -eq 0 ]; then
  echo "No matching agents found. Use --list to see them, or --all." >&2
  exit 1
fi

if [ "$UNINSTALL" = 1 ]; then
  for i in "${!TARGETS[@]}"; do
    for s in "${SKILLS[@]}" "${LEGACY[@]}"; do rm -rf "${TARGETS[$i]:?}/$s"; done
    echo "✓ removed from ${TARGETS[$i]}  (${LABELS[$i]})"
  done
  exit 0
fi

# Find the skills: local checkout first, otherwise download the repo
SRC=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || true)"
if [ -n "$SCRIPT_DIR" ] && [ -f "$SCRIPT_DIR/skills/batbout/SKILL.md" ]; then
  SRC="$SCRIPT_DIR/skills"
else
  [ "$LINK" = 0 ] || { echo "--link needs a local clone: run ./install.sh --link from the repo." >&2; exit 1; }
  command -v curl >/dev/null || { echo "curl is required." >&2; exit 1; }
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  echo "Downloading $REPO@$REF ..."
  curl -fsSL "https://codeload.github.com/$REPO/tar.gz/refs/heads/$REF" | tar -xz -C "$TMP"
  SRC="$(find "$TMP" -maxdepth 2 -type d -name skills | head -1)"
  [ -f "$SRC/batbout/SKILL.md" ] || { echo "Could not find skills in the download." >&2; exit 1; }
fi

for i in "${!TARGETS[@]}"; do
  mkdir -p "${TARGETS[$i]}"
  for s in "${LEGACY[@]}"; do rm -rf "${TARGETS[$i]:?}/$s"; done
  for s in "${SKILLS[@]}"; do
    rm -rf "${TARGETS[$i]:?}/$s"
    if [ "$LINK" = 1 ]; then ln -s "$SRC/$s" "${TARGETS[$i]}/$s"; else cp -R "$SRC/$s" "${TARGETS[$i]}/$s"; fi
  done
  echo "✓ ${TARGETS[$i]}  (${LABELS[$i]})"
done

echo
echo "batbout installed. Ask your agent to \"use batbout\" (Claude Code: /batbout <task>)."
echo "Restart your agent if it was already running."
