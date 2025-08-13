---
description: Structured design discussion with decision logging
argument-hint: <topic>
allowed-tools: Read, Write, Edit, MultiEdit, LS, Grep, Glob, Bash(git status:*)
---

# Start a structured design discussion about $ARGUMENTS

## **CRITICAL RULES - READ FIRST**

**COMMIT MESSAGES & VERBOSITY:**

- Keep responses concise and focused on the discussion topic
- Avoid unnecessary explanations or verbose summaries

## Safety and Constraint Checks

### 0. **SAFETY CHECK**: Verify @CLAUDE.md exists and read it

- Verify @CLAUDE.md exists at project root
- Read and internalize all critical rules
- **READ the "Slash Commands" section** of @CLAUDE.md for learned user preferences
- Apply those preferences throughout this discussion
- Pay special attention to:
  - "Let's X" means "let's discuss X" - NOT "do X now"
  - NEVER create files unless explicitly requested
  - NO unnecessary file creation or commits

### 1. **CONSTRAINT CHECK**: Confirm safe workspace state

- Run `git status` to verify no uncommitted work in progress
- Ensure no files being edited without user awareness
- Confirm discussion mode constraints are active

### 2. **Read Development Guidelines** if they exist:
- Check for @docs/DEV*.md files to understand project coding and development guidelines
- Follow those guidelines throughout the discussion and any suggestions

## Discussion Protocol

After safety checks pass, I will proceed with:

**IMPORTANT CONSTRAINTS:**

- During discussions, only provide answers and suggestions
- NEVER create files unless explicitly requested (e.g., "create", "make", "implement")
- "Let's X" means "let's discuss X" - NOT "do X now"
- If suggesting a structure, describe it - don't implement it
- Common mistake: Creating example files when user asks "what do you think?"
- NEVER commit without explicit user request (e.g., "commit this", "create a commit")

**USER PREFERENCES:**

- **Incremental Development**: Edit existing files with scope limits, create new files only for distinctly different functionality
- **Refactoring**: Make small, focused refactoring commits before implementing new features
- **Backward Compatibility**: NEVER assume backward compatibility is needed - always ASK explicitly
- **Documentation**: Update existing docs only when incorrect or for critical changes, NEVER create new docs unless asked
- **Planning Approach**: Discuss the approach first, then implement incrementally

1. **CONFIRM THE TOPIC**. After confirmation **IMMEDIATELY** use the user specified log file or create a decision log
file named `<TOPIC>_DISCUSSION.md` (uppercase version of the topic) in the project's scratchpad directory. If such a
directory does not exist then encourage the user to make one called `_scratchpad` at the project's root directory.

2. **Ask questions one at a time** with:
   - Clear options (a, b, c, etc.)
   - Context-appropriate detail level:
     - Technical topics: capabilities, trade-offs, performance
     - Creative topics: user experience, workflows
     - Business topics: impact, effort, risks
   - Wait for your confirmation before proceeding
   - For complex architectural decisions, I may think deeply to provide thorough analysis

3. **Maintain a decision log** in ADR (Architecture Decision Record) format with:
   - Hybrid overview at top (summary + key decisions + open questions + stats)
   - Each decision documented with: Status, Context, Options Considered, Decision, Consequences
   - Session markers when resuming discussions
   - Sub-decisions for important clarifications
   - **Dual save approach: immediate raw logging + clean summary**
   - **NO TIMELINES: The plan document should focus on decisions and design choices, never include timeline estimates,
   deadlines, or time-based commitments**

4. **Handle discussion flow**:
   - Start broad, then narrow down with iterative refinement
   - Adapt specificity based on your engagement level
   - Allow deferring questions (revisit after 3-4 others)
   - Context-sensitive scope management for related topics
   - Natural session ending with optional summary prompt
   - For implementation discussions: Focus on incremental steps, not big-bang changes

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
