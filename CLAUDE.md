# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See @README.md for project overview.

## Project Structure

```
nebulae/
├── scripts/          # Minimal bash scripts
│   └── bootstrap.sh  # Initial setup only
├── README.md         # Project overview
├── CLAUDE.md         # This file
├── AGENTS.md         # Symlink to CLAUDE.md
└── GEMINI.md         # Symlink to CLAUDE.md
```

## Repository Guidelines

### Code Style

- Prefer higher-level languages (Python, Go, etc.) over bash for complex logic
- Keep bash scripts minimal and focused on bootstrapping only

### Tool Development

- Each tool lives in its own directory under root
- Tools are self-contained with their own dependencies and README.md
- Each tool manages its own build/test/lint/deploy setup

### Requirements

- DO NOT create new bash scripts unless absolutely necessary for bootstrapping
- ALWAYS check existing tool directories before creating new ones
- ALWAYS document tool-specific commands in the tool's README.md
- ALWAYS test changes before suggesting commits

### Commit Messages

- List only direct file/feature additions, not implementation details
- Avoid mentioning how things work internally
- No forward-looking statements about future plans
- Keep messages factual and concise
