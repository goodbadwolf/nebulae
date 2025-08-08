# Pandora Slash Commands

Custom slash commands for AI code assistants.

## Structure

```
slash-commands/
├── claude/           # Claude agent
│   ├── claude/       # claude namespace
│   │   ├── discuss.md
│   │   └── think.md
│   └── git/          # git namespace
│       └── commit.md
├── codex/            # Codex agent (future)
└── gemini/           # Gemini agent (future)
```

Pattern: `<agent>/<namespace>/<command>.md`

## Key Features

- **Project-aware**: Commands read CLAUDE.md for project conventions
- **Safety-first**: Enforces best practices (no `git add .`, no `--no-verify`)
- **Learning system**: Commands adapt to user patterns and preferences (stored in command files)
- **Interactive workflows**: Smart defaults with override options

## Installation

### Claude Code
Single symlink for all namespaces:

```bash
ln -sf ~/projects/nebulae/pandora/slash-commands/claude ~/.claude/commands
```

This makes all namespaces available:
- `/claude:discuss` - from `claude/claude/discuss.md`
- `/claude:think` - from `claude/claude/think.md`
- `/git:commit` - from `claude/git/commit.md`

## Current Commands

### claude namespace
- `/claude:discuss` - Start a structured design discussion with decision logging
- `/claude:think` - Deep thinking and planning mode with extended reasoning

### git namespace  
- `/git:commit` - Smart git commit workflow with context-aware staging and message generation

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

## Troubleshooting

### Commands not appearing
- Verify symlink: `ls -la ~/.claude/commands`
- Restart Claude Code after creating symlink
- Check command file has proper frontmatter

### Command errors
- Ensure allowed-tools are specified in frontmatter
- Check CLAUDE.md exists in project root
- Verify git is configured for git commands

### Learning not persisting
- Patterns are stored in individual command files
- Updates require manual editing of command .md files
- Session learnings prompt for persistent updates
