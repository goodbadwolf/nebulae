#!/bin/bash

# Minimal bootstrap for Nebulae monorepo
# Only does the bare minimum before handing off to higher-level tools

set -e

get_project_root() {
  local current_dir
  current_dir="$(pwd)"

  while [ "$current_dir" != "/" ]; do
    if [ -f "$current_dir/CLAUDE.md" ]; then
      echo "$current_dir"
      return 0
    fi
    current_dir="$(dirname "$current_dir")"
  done

  print_error "Could not determine project root (CLAUDE.md not found)"
  exit 1
}

print_step() {
  echo "==> $1"
}

print_success() {
  echo "✓ $1"
}

print_error() {
  echo "✗ $1" >&2
}

abort() {
  print_error "$1"
  exit 1
}

create_ai_links() {
  local project_root
  project_root=$1

  cd "$project_root" || {
    abort "Failed to change to project root: $project_root"
  }

  if [ ! -f "CLAUDE.md" ]; then
    abort "CLAUDE.md not found in $project_root"
  fi

  ln -sf CLAUDE.md AGENTS.md
  print_success "Created AGENTS.md -> CLAUDE.md"

  ln -sf CLAUDE.md GEMINI.md
  print_success "Created GEMINI.md -> CLAUDE.md"

  return 0
}

main() {
  local project_root
  project_root=$(get_project_root)

  print_step "Bootstrapping Nebulae"

  create_ai_links "$project_root" || abort "Failed to create AI links"

  print_success "Bootstrap complete"
}

main "$@"
