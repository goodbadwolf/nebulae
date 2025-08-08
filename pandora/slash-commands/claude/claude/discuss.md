---
description: Structured design discussion with decision logging
argument-hint: <topic>
---

Start a structured design discussion about $ARGUMENTS.

## Discussion Protocol

When I receive this command, I will:

**IMPORTANT CONSTRAINTS:**
- During discussions, only provide answers and suggestions
- NEVER create files unless explicitly requested (e.g., "create", "make", "implement")
- If suggesting a structure, describe it - don't implement it
- Common mistake: Creating example files when user asks "what do you think?"

0. **READ PROJECT GUIDELINES**. First, carefully read @CLAUDE.md to understand project conventions and requirements. Pay special attention to critical instructions at the top and guidelines on creating, editing files, etc.

1. **CONFIRM THE TOPIC**. After confirmation **IMMEDIATELY** use the user specified log file or create a decision log file named `<TOPIC>_LOG.md` (uppercase version of the topic)

2. **Ask questions one at a time** with:
   - Clear options (a, b, c, etc.)
   - Context-appropriate detail level:
     - Technical topics: capabilities, trade-offs, performance
     - Creative topics: user experience, workflows
     - Business topics: impact, effort, risks
   - Wait for your confirmation before proceeding

3. **Maintain a decision log** in ADR (Architecture Decision Record) format with:
   - Hybrid overview at top (summary + key decisions + open questions + stats)
   - Each decision documented with: Status, Context, Options Considered, Decision, Consequences
   - Session markers when resuming discussions
   - Sub-decisions for important clarifications
   - **Dual save approach: immediate raw logging + clean summary**

4. **Handle discussion flow**:
   - Start broad, then narrow down with iterative refinement
   - Adapt specificity based on your engagement level
   - Allow deferring questions (revisit after 3-4 others)
   - Context-sensitive scope management for related topics
   - Natural session ending with optional summary prompt

5. **Special behaviors**:
   - If no topic given: Resume last discussion or show available discussions
   - If already in discussion: Show current status and progress
   - If you ask clarifying questions: Pause main flow, explore, then continue
   - If earlier decisions need revision: Handle context-sensitively

## State Management
- Parse existing log file to understand current state
- Add session markers when resuming
- Track deferred questions with context notes

Begin by confirming if you want to start/resume a discussion about "$ARGUMENTS".
