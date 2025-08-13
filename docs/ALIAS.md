# ALIAS

A comprehensive naming guide for AI assistants to help generate names for projects in the Nebulae universe.

## The Philosophy

Think of this as a baby registry for hobby projects. These are not corporate products or serious ventures - they're
creative expressions that deserve names with personality, cultural depth, and a touch of whimsy. The goal is to find
names that are phonetically beautiful, functionally connected to their purpose, culturally rich, and uniquely memorable.

## Existing Examples

The Nebulae universe already contains several projects that demonstrate the naming philosophy:

- **Nebulae** - The monorepo itself, representing a universe of tools
- **Tanaka** - Firefox extension for tab synchronization (Japanese surname, elegant and personal)
- **Pandora** - Documentation and command system (Greek mythology, mysterious and powerful)
- **Bashira** - Bash utility library (Arabic: بشيرة - "bringer of good news")
- **Kiku** - TypeScript utility library (Japanese: 菊 - chrysanthemum, symbol of perfection)
- **Pixel Heal Thyself** - ML image denoising project (wordplay on "Physician Heal Thyself")

## Cultural & Linguistic Sources

Draw inspiration from these rich traditions:

### Languages

- **English** - For wordplay, puns, and familiar concepts
- **Hindi** - Sanskrit roots, philosophical concepts
- **Malayalam** - South Indian linguistic beauty
- **Arabic** - Classical and modern terms
- **Latin** - Ancient wisdom, scientific naming
- **French** - Elegant expressions
- **German** - Compound words, technical precision
- **Japanese** - Aesthetic concepts, cultural depth
- **Chinese** - Classical wisdom, symbolic meaning

### Mythological Traditions

- **Nordic** - Gods, concepts, cosmic elements
- **Greek** - Classical mythology, philosophical concepts
- **Roman** - Imperial strength, systematic thinking
- **Arabic** - Rich storytelling tradition
- **Indian** - Vedic concepts, epic traditions
- **Japanese** - Kami, folklore, spiritual concepts
- **Chinese** - Classical literature, philosophical traditions

### Pop Culture Sources

- **Sci-Fi** - Futuristic concepts, space exploration
- **Fantasy** - Magical systems, otherworldly concepts
- **Anime** - Japanese cultural concepts, creative naming

## Quality Criteria

When evaluating name suggestions, consider:

1. **Phonetic Beauty** - Does it sound pleasing and memorable?
2. **Functional Connection** - Is there a meaningful relationship to the tool's purpose?
3. **Cultural Depth** - Does it carry interesting backstory or symbolic meaning?
4. **Uniqueness** - Does it stand out in the tech ecosystem?
5. **Accessibility** - Can it be reasonably pronounced by others?

## Template Variables

When using the prompts below, replace these placeholders with your specific information:

### Basic Variables

- `{{PROJECT_TYPE}}` - web app, CLI tool, library, extension, etc.
- `{{BRIEF_DESCRIPTION}}` - 1-2 sentence description of what it does
- `{{DETAILED_PROJECT_DESCRIPTION}}` - Comprehensive explanation including purpose, features, and context
- `{{SPECIFIC_QUALITIES_DESIRED}}` - elegant, powerful, minimalist, playful, etc.
- `{{PROJECT_DESCRIPTION}}` - Detailed description of the project and its functionality
- `{{PROJECT_FUNCTION}}` - Core function like "file synchronization" or "data visualization"

### Cultural/Thematic Variables

- `{{SPECIFIC_THEME_CULTURE}}` - Japanese mythology, Norse traditions, Arabic poetry, etc.
- `{{CHOSEN_CULTURAL_SOURCE}}` - The specific culture you want to explore
- `{{PREFERRED_CULTURE_OR_ANY}}` - Your cultural preference or "any" for diverse options

### Example Values

```text
PROJECT_TYPE: "TypeScript utility library"
BRIEF_DESCRIPTION: "provides type-safe object manipulation functions"
DETAILED_PROJECT_DESCRIPTION: "A TypeScript library that offers runtime-safe object operations with full type inference, helping developers avoid common pitfalls when working with dynamic data structures"
SPECIFIC_QUALITIES_DESIRED: "reliable, elegant, developer-friendly"
SPECIFIC_THEME_CULTURE: "Japanese craftsmanship and precision"
```

## Template Prompts

### Quick Generation Prompt

```text
I need a name for my {{PROJECT_TYPE}} that {{BRIEF_DESCRIPTION}}.

Generate 5 diverse name suggestions drawing from:
- Multiple languages (Hindi, Arabic, Japanese, Latin, etc.)
- Mythological traditions (Greek, Nordic, Indian, etc.)
- Pop culture (sci-fi, fantasy, anime)

For each suggestion, provide:
1. The name
2. Language/cultural origin
3. Meaning/connection to function
4. Why it fits the project

Style: Whimsical but meaningful, like naming a personal creative project.

Examples from my other projects: Tanaka (Japanese, tab sync), Kiku (Japanese perfection, TypeScript utils), Pixel Heal Thyself (wordplay on healing phrase).
```

### Detailed Exploration Prompt

```text
I'm working on {{DETAILED_PROJECT_DESCRIPTION}} and need a name that captures {{SPECIFIC_QUALITIES_DESIRED}}.

My naming philosophy embraces:
- Cultural depth from global traditions
- Wordplay and linguistic creativity  
- Meaningful connections to function
- Phonetic beauty and memorability
- Whimsical but purposeful character

Please explore names from multiple cultural sources:

Languages: English, Hindi, Malayalam, Arabic, Latin, French, German, Japanese, Chinese
Mythologies: Nordic, Greek, Roman, Arabic, Indian, Japanese, Chinese
Pop Culture: Sci-Fi, Fantasy, Anime

For each suggestion, explain:
- Cultural/linguistic origin and meaning
- Connection to the project's purpose or personality
- Phonetic qualities that make it appealing
- Any interesting cultural context or backstory

Generate 8-10 diverse options, then we can refine based on what resonates.
```

### Themed Generation Prompt

```text
I need a name for {{PROJECT_DESCRIPTION}} and I'm drawn to {{SPECIFIC_THEME_CULTURE}}.

Based on my existing projects (Tanaka, Kiku, Bashira, Pandora), generate names that:
1. Draw specifically from {{CHOSEN_CULTURAL_SOURCE}}
2. Connect meaningfully to {{PROJECT_FUNCTION}}
3. Maintain the whimsical-but-purposeful tone
4. Offer both obvious and unexpected connections

Please provide:
- 5 names with clear functional connections
- 3 names with poetic/metaphorical connections
- 2 wildcard options that might surprise me

Include pronunciation guides and cultural context for each suggestion.
```

## Optimized Prompts

### Structured Generation Prompt

```text
You are a creative naming assistant for software projects. Your task is to generate 5 diverse and whimsical name suggestions for a project based on the given project type and description. Here's what you need to do:

First, you will be provided with two pieces of information:
<project_type>{{PROJECT_TYPE}}</project_type>
<brief_description>{{BRIEF_DESCRIPTION}}</brief_description>

Using this information, generate 5 unique name suggestions for the project. Each suggestion should draw inspiration from one of the following sources:
- Multiple languages (such as Hindi, Arabic, Japanese, Latin, etc.)
- Mythological traditions (like Greek, Nordic, Indian, etc.)
- Pop culture references (including sci-fi, fantasy, anime)

For each name suggestion, provide the following details:
1. The suggested name
2. The language or cultural origin of the name
3. The meaning of the name and its connection to the project's function
4. A brief explanation of why this name fits the project

Remember to keep the style whimsical but meaningful, like naming a personal creative project.

Here are some examples to guide your style:
- Tanaka (Japanese, for a tab sync project)
- Kiku (Japanese word for perfection, used for TypeScript utils)
- Pixel Heal Thyself (wordplay on a healing phrase)

After generating all 5 name suggestions, present your output in the following format:

<name_suggestions>
<suggestion1>
<name>[Suggested Name 1]</name>
<origin>[Language/Cultural Origin]</origin>
<meaning>[Meaning and Connection to Function]</meaning>
<fit>[Why it fits the project]</fit>
</suggestion1>

<suggestion2>
[...repeat structure for suggestion 2...]
</suggestion2>

<suggestion3>
[...repeat structure for suggestion 3...]
</suggestion3>

<suggestion4>
[...repeat structure for suggestion 4...]
</suggestion4>

<suggestion5>
[...repeat structure for suggestion 5...]
</suggestion5>
</name_suggestions>

Your final output should only include the name suggestions within the specified XML tags. Do not include any additional commentary or explanations outside of these tags.
```

### Advanced Structured Prompt

```text
You are a creative naming specialist tasked with generating unique and meaningful names for a project. Your goal is to create a diverse set of name options that align with the project's description and desired qualities while adhering to a specific naming philosophy.

First, carefully read and consider the following project description and desired qualities:

<project_description>
{{DETAILED_PROJECT_DESCRIPTION}}
</project_description>

<desired_qualities>
{{SPECIFIC_QUALITIES_DESIRED}}
</desired_qualities>

Keep these in mind as you generate names. The naming philosophy you should follow embraces:
- Cultural depth from global traditions
- Wordplay and linguistic creativity
- Meaningful connections to function
- Phonetic beauty and memorability
- Whimsical but purposeful character

Explore names from multiple cultural sources, including:

Languages: English, Hindi, Malayalam, Arabic, Latin, French, German, Japanese, Chinese
Mythologies: Nordic, Greek, Roman, Arabic, Indian, Japanese, Chinese
Pop Culture: Sci-Fi, Fantasy, Anime

For each name suggestion, provide the following information:
1. The suggested name
2. Cultural/linguistic origin and meaning
3. Connection to the project's purpose or personality
4. Phonetic qualities that make it appealing
5. Any interesting cultural context or backstory

Generate 8-10 diverse name options. Present each option in the following format:

<name_option>
<suggested_name>[Insert name here]</suggested_name>
<origin_and_meaning>[Explain cultural/linguistic origin and meaning]</origin_and_meaning>
<connection_to_project>[Describe how it relates to the project's purpose or personality]</connection_to_project>
<phonetic_appeal>[Explain the phonetic qualities that make it appealing]</phonetic_appeal>
<cultural_context>[Provide any interesting cultural context or backstory]</cultural_context>
</name_option>

After presenting all options, conclude with a brief summary encouraging further refinement based on what resonates most with the project goals.
```

### Themed Exploration Prompt

```text
You are a creative AI assistant tasked with generating culturally-inspired project names. Your goal is to create a list of unique, meaningful names that align with the project's description and function while drawing inspiration from a specific cultural theme.

Here are the details for the naming task:

<project_description>
{{PROJECT_DESCRIPTION}}
</project_description>

<cultural_theme>
{{SPECIFIC_THEME_CULTURE}}
</cultural_theme>

<project_function>
{{PROJECT_FUNCTION}}
</project_function>

Follow these guidelines to generate the names:

1. Draw specifically from the chosen cultural source ({{SPECIFIC_THEME_CULTURE}}).
2. Ensure each name connects meaningfully to the project's function ({{PROJECT_FUNCTION}}).
3. Maintain a creative and personal tone, not corporate or generic, similar to existing project names like Tanaka, Kiku, Bashira, and Pandora.
4. Offer both obvious and unexpected connections to the project's description and function.

Generate the following set of names:
- 5 names with clear functional connections
- 3 names with poetic/metaphorical connections
- 2 wildcard options that might surprise the user

For each name suggestion, provide:
1. The name itself
2. A pronunciation guide
3. Cultural context and meaning
4. How it relates to the project's function or description

Be mindful of cultural sensitivity and avoid appropriation or stereotyping. Ensure that the names are respectful and accurately represent the chosen cultural theme.

Your final output should be structured as follows:

<name_suggestions>
<functional_connections>
[List 5 names with clear functional connections, including pronunciation, cultural context, and relation to the project]
</functional_connections>

<poetic_connections>
[List 3 names with poetic/metaphorical connections, including pronunciation, cultural context, and relation to the project]
</poetic_connections>

<wildcard_options>
[List 2 surprising wildcard options, including pronunciation, cultural context, and relation to the project]
</wildcard_options>
</name_suggestions>

Ensure that your final output contains only the name suggestions within the specified tags, without any additional commentary or explanations outside of these tags.
```

## Usage Guidelines

1. **Be Specific** - The more context you provide about your project, the better the suggestions
2. **Embrace Iteration** - Don't expect the perfect name immediately; explore and refine
3. **Trust Your Instincts** - The right name will feel right when you encounter it
4. **Consider the Ecosystem** - Think about how it fits with your other project names
5. **Have Fun** - This is about creative expression, not corporate branding

## Anti-Patterns to Avoid

While there are no hard rules, be cautious of:

- Names that are too similar to existing major tools/products
- Overly long or complex names that are hard to remember
- Names that might be offensive in any of the source cultures
- Generic tech naming patterns (adding -ify, -hub, -kit, etc.)

Remember: You're naming a creative project, not a startup. Embrace the whimsy and cultural richness that makes your work
 unique.
