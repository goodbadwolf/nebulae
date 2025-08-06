# Pandora Slash Commands

Custom slash commands for AI code assistants.

## Structure

```
slash-commands/
├── claude/           # Claude agent
│   ├── claude/       # claude namespace
│   │   ├── discuss.md
│   │   └── think.md
│   └── git/          # git namespace (future)
│       └── commit.md
├── codex/            # Codex agent (future)
└── gemini/           # Gemini agent (future)
```

Pattern: `<agent>/<namespace>/<command>.md`

## Installation

### Claude Code
Single symlink for all namespaces:

```bash
ln -sf ~/projects/nebulae/pandora/slash-commands/claude ~/.claude/commands
```

This makes all namespaces available:
- `/claude:discuss` - from `claude/claude/discuss.md`
- `/claude:think` - from `claude/claude/think.md`
- `/git:commit` - from `claude/git/commit.md` (future)

## Current Commands

### claude namespace
- `/claude:discuss` - Start a structured design discussion
- `/claude:think` - Deep thinking and planning mode

## Command Format

Commands are markdown files with optional frontmatter. See
[Claude Code Slash Commands Documentation](https://docs.anthropic.com/en/docs/claude-code/slash-commands) for full
details.

```markdown
---
allowed-tools: Tool1, Tool2
argument-hint: <description>
description: Brief command description
model: claude-3-5-sonnet-20241022
---

Command instructions using $ARGUMENTS
```
