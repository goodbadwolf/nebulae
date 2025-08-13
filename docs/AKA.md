# AKA

An interactive guide for exploring project names through conversation with AI assistants.

## How to Use This Guide

This document provides conversation templates and workflows for discovering the perfect name for your project.
Unlike ALIAS.md (the comprehensive reference), this is designed for iterative exploration and refinement.

## Template Variables

When using the structured prompts below, replace these placeholders with your specific information:

### Basic Variables

- `{{PROJECT_DESCRIPTION}}` - Comprehensive description of your project and what it does
- `{{BRIEF_DESCRIPTION}}` - Short, focused description of core functionality
- `{{PROJECT_FUNCTION}}` - Primary function like "code formatting" or "data analysis"

### Exploration Variables

- `{{SPECIFIC_CULTURE_OR_LANGUAGE}}` - Japanese, Arabic, Norse mythology, etc.
- `{{WHAT_I_LIKED_ABOUT_INITIAL_SUGGESTIONS}}` - What appealed to you in previous suggestions
- `{{LIST_OF_NAMES_I_LIKE}}` - Comma-separated list of names you're considering
- `{{WHAT_I_LIKE_ABOUT_THESE_NAMES}}` - Common qualities that appeal to you
- `{{SPECIFIC_CONCERNS_OR_IMPROVEMENTS_NEEDED}}` - What needs to be different/better

### Thematic Variables

- `{{THEME_OR_CONCEPT}}` - Abstract theme like "transformation", "flow", "precision"
- `{{PREFERRED_CULTURES_OR_ALL}}` - Specific cultures to focus on or "all cultures"
- `{{WHERE_IM_STUCK_OR_WHAT_ISNT_WORKING}}` - Description of your naming challenges

### Example Values

```text
PROJECT_DESCRIPTION: "A command-line tool that automatically organizes project files based on intelligent categorization rules"
SPECIFIC_CULTURE_OR_LANGUAGE: "Sanskrit and ancient Indian philosophy"
WHAT_I_LIKED_ABOUT_INITIAL_SUGGESTIONS: "the connection to wisdom and order, plus the beautiful sound patterns"
THEME_OR_CONCEPT: "bringing order from chaos"
```

## Basic Exploration Workflow

### Step 1: Project Introduction

Start your conversation with:

```text
I'm working on a hobby project and need help finding a name. Here's what it does:

{{PROJECT_DESCRIPTION}}

I follow a multicultural naming philosophy that draws from global languages, mythologies, and pop culture. Style: Creative and personal, not corporate or generic.

Can you ask me some questions to understand what kind of name would fit best?
```text

### Step 2: AI Discovery Questions

Guide the AI to ask you about:

**Functional Aspects:**

- What's the core purpose of this tool?
- Who is the intended user?
- What problem does it solve?
- How would you describe its "personality"?

**Cultural Preferences:**

- Are you drawn to any particular languages or cultures?
- Any mythological traditions that resonate?
- Pop culture themes you enjoy (sci-fi, fantasy, anime)?

**Aesthetic Preferences:**

- Do you prefer short, punchy names or longer, descriptive ones?
- Any specific sounds or phonetic qualities you like?
- Names that are obvious about function vs. more poetic/metaphorical?

### Step 3: First Round Generation

Ask the AI to generate options based on your answers:

```

Based on our discussion, please generate 6-8 name options from different cultural sources. For each, include:

1. The name and pronunciation
2. Language/cultural origin
3. Meaning and connection to my project
4. Why you think it fits my style

Mix obvious functional connections with more poetic/metaphorical ones.

```text

## Refinement Workflows

### Workflow A: Cultural Deep Dive

If you find a cultural source you like:

```

I'm really drawn to {{SPECIFIC_CULTURE_OR_LANGUAGE}} from your suggestions. Can you explore that tradition more deeply?

Generate 5-7 additional names from {{SPECIFIC_CULTURE_OR_LANGUAGE}}, including:

- Both common and lesser-known terms
- Different aspects of the culture (mythology, daily life, philosophy)
- Variations in complexity and obviousness

Also suggest related cultural sources I might explore.

```text

### Workflow B: Functional Refinement

If you want names more connected to function:

```

I like the cultural richness of your suggestions, but I'd like options more directly connected to {{PROJECT_FUNCTION}}.

Can you generate names that:

- Still draw from diverse cultural sources
- Have clearer functional connections
- Maintain the whimsical character
- Show how the cultural meaning relates to the technical purpose

```text

### Workflow C: Phonetic Exploration

If you're drawn to certain sounds:

```

I really like the sound of {{LIST_OF_NAMES_I_LIKE}} from your suggestions. Can you generate more names with similar
phonetic qualities?

Focus on:

- Similar sound patterns or syllable structures
- Same language family or related cultures
- Names that feel like they belong in the same "universe"

```text

### Workflow D: Thematic Clustering

For discovering unexpected connections:

```

Let's explore {{THEME_OR_CONCEPT}} (e.g., "water," "light," "transformation") across different cultures.

Generate names related to this theme from:

- 3-4 different languages
- 2-3 mythological traditions  
- 1-2 pop culture sources

Show how each culture interprets this theme differently and how it might connect to my project.

```text

## Advanced Exploration Techniques

### Technique 1: Etymology Journey

```

Take the name {{LIST_OF_NAMES_I_LIKE}} and explore its linguistic family. What are:

- Related words in the same language?
- Cognates in related languages?
- Historical variations or evolution?
- Compound possibilities?

This can reveal variations that might fit even better.

```text

### Technique 2: Mythological Clustering

```

If {{THEME_OR_CONCEPT}} resonates with my project, what are:

- Related figures from the same tradition?
- Similar concepts from other mythologies?
- Modern interpretations or derivatives?
- Lesser-known aspects of the same figure?

```text

### Technique 3: Functional Metaphor Expansion

```

My project {{PROJECT_FUNCTION}}. What are different cultural metaphors for this concept?

For example, if it's about "organizing," explore:

- How different cultures think about order/organization
- Mythological figures associated with structure
- Natural phenomena that represent organization
- Cultural practices around organizing

```text

### Technique 4: Linguistic Play

```

Take {{PROJECT_FUNCTION}} and explore creative linguistic approaches:

- Translations into multiple languages
- Poetic or archaic versions
- Compound word possibilities
- Phonetic similarities that create wordplay
- False etymologies that create interesting connections

```text

## Conversation Starters for Different Scenarios

### When You're Stuck

```

I'm building {{PROJECT_DESCRIPTION}} but feeling stuck on naming. Can you help me approach this differently?

Maybe start by asking me what I DON'T want in a name, or help me explore unexpected cultural connections I haven't considered.

```text

### When You Have Too Many Options

```

I have these names I like: {{LIST_OF_NAMES_I_LIKE}}.

Can you help me:

1. Identify what these names have in common?
2. Explore similar options in the same vein?
3. Help me think through trade-offs between them?

```text

### When You Want Something Unexpected

```

Surprise me! My project {{PROJECT_DESCRIPTION}} - but instead of obvious naming approaches, what are some unexpected cultural
 connections or creative interpretations you can explore?

Think lateral connections, false etymologies that work poetically, or creative misappropriations that are respectful but
 playful.

```text

### When You're Almost There

```

I'm close! I like {{LIST_OF_NAMES_I_LIKE}} but it's not quite perfect because {{SPECIFIC_CONCERNS_OR_IMPROVEMENTS_NEEDED}}.

Can you:

- Generate variations that address this issue?
- Explore the same cultural area for alternatives?
- Find similar names from different cultures?

```text

## Structured Interactive Prompts

### Initial Discovery Prompt

```text
You are a creative naming consultant helping me find the perfect name for my project. Your role is to guide me through a discovery process to understand what kind of name would work best.

<project_overview>
{{PROJECT_DESCRIPTION}}
</project_overview>

I follow a multicultural naming philosophy that draws from global languages, mythologies, and pop culture. Style: Creative and personal, not corporate or generic.

Please ask me 3-4 targeted questions to understand:
1. The project's core function and personality
2. My cultural or aesthetic preferences
3. Whether I prefer obvious functional names vs. poetic/metaphorical ones
4. Any specific themes or inspirations I'm drawn to

After my responses, suggest 6-8 diverse name options from different cultural sources, providing for each:
- The name and pronunciation
- Language/cultural origin
- Meaning and connection to my project
- Why you think it fits my style

Structure your questions to be engaging and help me discover preferences I might not have considered.
```

### Cultural Deep Dive Prompt

```text
I'm exploring names from a specific cultural tradition for my project. Please help me dive deeper into this source.

<project_context>
{{PROJECT_DESCRIPTION}}
</project_context>

<chosen_culture>
{{SPECIFIC_CULTURE_OR_LANGUAGE}}
</chosen_culture>

<what_appeals>
{{WHAT_I_LIKED_ABOUT_INITIAL_SUGGESTIONS}}
</what_appeals>

Generate 7-8 additional names from {{SPECIFIC_CULTURE_OR_LANGUAGE}}, including:
- Both common and lesser-known terms
- Different aspects of the culture (mythology, daily life, philosophy, arts)
- Variations in complexity and directness
- Related cultural sources I might explore

For each suggestion, provide:
- Name and pronunciation guide
- Cultural context and meaning
- Connection to my project
- Interesting backstory or associations

Also suggest 2-3 related cultural traditions that share similar linguistic roots or thematic elements.

Present your response in this format:

<cultural_exploration>
<main_suggestions>
[7-8 names with full context]
</main_suggestions>

<related_traditions>
[2-3 related cultural sources to explore]
</related_traditions>
</cultural_exploration>
```text

### Refinement and Iteration Prompt

```text
I need help refining my naming direction based on options I'm considering. Please help me analyze and expand on what's working.

<current_favorites>
{{LIST_OF_NAMES_I_LIKE}}
</current_favorites>

<what_works>
{{WHAT_I_LIKE_ABOUT_THESE_NAMES}}
</what_works>

<what_needs_adjustment>
{{SPECIFIC_CONCERNS_OR_IMPROVEMENTS_NEEDED}}
</what_needs_adjustment>

Please help me:
1. Identify patterns in what appeals to me
2. Generate 5-6 variations that address my concerns
3. Explore similar names from different cultural sources
4. Suggest unexpected alternatives that share the same qualities

For each new suggestion, explain:
- How it builds on what I liked
- How it addresses my concerns
- Why it might work even better

Format your response as:

<refinement_analysis>
<pattern_analysis>
[What themes/qualities appeal to you based on your favorites]
</pattern_analysis>

<refined_suggestions>
[5-6 new options with explanations]
</refined_suggestions>

<alternative_directions>
[2-3 unexpected options that share the same appeal]
</alternative_directions>
</refinement_analysis>
```

### Thematic Exploration Prompt

```text
I want to explore names related to a specific theme or concept across different cultures. Help me discover how different traditions interpret this idea.

<project_context>
{{PROJECT_DESCRIPTION}}
</project_context>

<exploration_theme>
{{THEME_OR_CONCEPT}}
</exploration_theme>

<cultural_scope>
{{PREFERRED_CULTURES_OR_ALL}}
</cultural_scope>

Explore how the theme of "{{THEME_OR_CONCEPT}}" is represented across:
- 4-5 different languages/cultures
- 2-3 mythological traditions
- 1-2 pop culture sources (sci-fi, fantasy, anime)

For each cultural interpretation, provide:
- 2-3 name options
- How that culture uniquely views this theme
- Connection to my project's function
- Interesting cultural context

Show me how this single theme creates a diverse family of potential names, each with its own cultural flavor and connection to my project.

Present as:

<thematic_exploration>
<cultural_interpretations>
[Each culture's take on the theme with 2-3 names]
</cultural_interpretations>

<synthesis>
[How these different interpretations might influence your final choice]
</synthesis>
</thematic_exploration>
```text

### Stuck and Need Direction Prompt

```text
I'm feeling stuck in my naming process and need a fresh perspective. Help me approach this differently.

<project_details>
{{PROJECT_DESCRIPTION}}
</project_details>

<current_situation>
{{WHERE_IM_STUCK_OR_WHAT_ISNT_WORKING}}
</current_situation>

Instead of traditional naming approaches, please help me:
1. Identify what I DON'T want in a name (to clarify preferences)
2. Explore unexpected cultural connections I haven't considered
3. Find lateral or metaphorical connections to my project
4. Discover naming patterns from my existing project ecosystem

Ask me 2-3 diagnostic questions to understand my blocks, then suggest:
- 3-4 completely different naming directions
- Unexpected cultural sources that might resonate
- Creative exercises to break through the naming block

Be creative and help me see my project from new angles that might reveal the perfect name.
```

## Tips for Better AI Conversations

1. **Be Conversational** - Treat the AI like a creative collaborator, not a search engine
2. **Provide Feedback** - Tell the AI what you like and don't like about suggestions
3. **Ask Questions** - Get the AI to explain cultural context or connections you don't understand
4. **Iterate Freely** - Don't worry about "perfect" initial descriptions; refine as you go
5. **Follow Curiosity** - If something interesting emerges, pursue that thread
6. **Mix Approaches** - Combine different workflows in the same conversation

## Remember

This is about creative exploration and discovery. The perfect name might come from an unexpected direction, so stay open
to surprises and trust the process.
