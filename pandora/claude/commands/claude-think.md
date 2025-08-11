---
description: Extended thinking for complex problem-solving
argument-hint: <topic or problem to think about> [think harder|think more|think longer]
allowed-tools: Read, Grep, Glob, LS, Bash(git status:*), Bash(git diff:*), Bash(git log:*)
---

# Extended Thinking Mode

## Purpose

This command triggers extended thinking for complex tasks that require deep reasoning, such as:

- Planning complex architectural changes
- Debugging intricate issues  
- Creating implementation plans for new features
- Understanding complex codebases
- Evaluating tradeoffs between different approaches
- Solving challenging bugs or performance problems

## How to Use

Provide context and specify thinking intensity. If not provided, ask the user for these:

```text
/claude-think implement OAuth2 authentication system
/claude-think debug memory leak in production harder
/claude-think refactor database layer for better performance more
/claude-think plan migration strategy from REST to GraphQL longer
```

## Thinking Depth

The command adjusts thinking depth based on intensity modifiers:

- **Basic**: `/claude-think <topic>` - Standard extended thinking
- **Deeper**: Add "harder", "more", or "deeply" for more thorough analysis
- **Maximum**: Add "longer" or "a lot" for most complex problems

## Process

When invoked, I will:

1. **Read @CLAUDE.md** to understand project conventions and constraints

2. **Gather Context** about the problem:
   - Analyze relevant code and documentation
   - Check current system state if needed
   - Identify constraints and requirements

3. **Think Deeply** about $ARGUMENTS:
   - Consider multiple approaches
   - Evaluate tradeoffs
   - Work through the problem step-by-step
   - Try different methods if first approach doesn't work
   - Verify solutions mentally before proposing

4. **Provide Solution** with:
   - Clear reasoning and rationale
   - Identified risks and mitigations
   - Implementation recommendations
   - Alternative approaches considered

## Best Practices

- **Be specific** about the problem you want solved
- **Provide context** about constraints or requirements
- **Use intensity modifiers** for complex problems requiring deeper analysis
- **Allow time** for thorough thinking on complex issues

## Examples

```bash
# Basic architectural planning
/claude-think design a caching strategy for our API

# Deeper debugging analysis  
/claude-think why does the test suite fail intermittently harder

# Maximum depth for complex problems
/claude-think optimize the entire data pipeline for 10x scale longer
```

Remember: Extended thinking works best with general instructions rather than prescriptive step-by-step guidance. Let me
approach the problem creatively for best results.
