# Claude Agent Resources

Resources and tools for the Claude AI agent.

## Structure

```text
claude/
└── commands/         # Slash commands for Claude Code
    ├── claude-discuss.md   # Structured design discussions
    ├── claude-think.md     # Extended thinking mode
    └── git-commit.md       # Intelligent git commits
```

Command naming pattern: `<prefix>-<action>.md`

## Key Features

- **Project-aware**: Commands read CLAUDE.md for project conventions
- **Safety-first**: Enforces best practices (no `git add .`, no `--no-verify`)
- **Learning system**: Commands adapt to user patterns and preferences (stored in command files)
- **Interactive workflows**: Smart defaults with override options

## Installation

### Claude Code

Symlink the commands directory:

```bash
ln -sf /path/to/nebulae/pandora/claude/commands ~/.claude/commands
```

## Current Commands

- **`/claude-discuss`** - Start a structured design discussion with decision logging
- **`/claude-think`** - Deep thinking and planning mode with extended reasoning
- **`/git-commit`** - Smart git commit workflow with context-aware staging and message generation

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
