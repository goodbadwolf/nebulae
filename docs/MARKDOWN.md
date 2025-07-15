# Markdown Style Guide

Consistent markdown formatting across the monorepo

## Markdown Flavor

This project uses [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/) which extends CommonMark with:

- Tables
- Task lists
- Strikethrough
- Autolinks
- Syntax highlighting in fenced code blocks

All documentation should be written to render correctly in GFM.

## File-Level Conventions

### File Properties

- **Extension**: Always use `.md`
- **Encoding**: UTF-8
- **Line endings**: Unix LF (`\n`)
- **Trailing newline**: Always end files with a single newline
- **Size limit**: Keep files under 500 KiB (GitHub truncates larger files)

### Standard Filenames

GitHub automatically surfaces these files:

- `README.md` - Project overview
- `LICENSE.md` - License information

GitHub checks for these files in order: `.github/` folder first, then root directory, then `docs/` folder.
Files in `.github/` take precedence over duplicates elsewhere.

## Document Structure

### Headings

- **One H1 per file**: Use `#` only for the document title
- **Hierarchical structure**: Don't skip heading levels (H1 → H2 → H3, not H1 → H3)
- **Spacing**: Add blank lines before and after headings
- **Capitalization**: Use sentence case for headings

```markdown
# Document Title

## Major Section

### Subsection

#### Minor Details
```

## Formatting Conventions

### Text Formatting

- **Bold**: Use `**text**` for emphasis
- **Italic**: Use `*text*` sparingly for subtle emphasis
- **Code**: Use `backticks` for inline code
- **Never use bold as headings**: Use proper heading levels instead

### Lists

#### Unordered Lists

- Use `-` (hyphen) consistently
- Add blank line before first item
- Indent nested items with 2 spaces

```markdown
- First item
  - Nested item
  - Another nested item
- Second item
```

#### Ordered Lists

- Use `1.` for all items (auto-numbering)
  - **Note**: Using `1.` for all items allows automatic renumbering when reordering
- Add blank line before first item

```markdown
1. First step
1. Second step
1. Third step
```

This renders as a properly numbered list (1, 2, 3) while making reordering painless.

### Code Blocks

Always specify the language for syntax highlighting:

````markdown
```bash
echo "Hello, World!"
```

```typescript
const greeting: string = "Hello, World!";
```

```text
Plain text without highlighting
```
````

### Links

- **Descriptive text**: Use `[descriptive text](url)` not `[click here](url)`
- **Relative paths**: Prefer relative links for internal documents
- **Reference style**: Use for repeated links

```markdown
[Good link text](../README.md)
[Another link][readme]

[readme]: ../README.md
```

### Tables

- Use pipes `|` with spaces for readability
- Include header separator row
- Align columns for better readability

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data     | Data     | Data     |
| Data     | Data     | Data     |
```

### GitHub-Specific Features

#### Callouts

Use GitHub's callout syntax for important information:

```markdown
> [!NOTE]
> Useful information that users should know.

> [!WARNING]
> Critical information requiring user attention.

> [!IMPORTANT]
> Essential information for users.

> [!TIP]
> Helpful advice for users.

> [!CAUTION]
> Advise caution with potential negative consequences.
```

#### Extended Features

GitHub supports additional formats like Mermaid diagrams, LaTeX math, and other specialized content types.
See [GitHub's documentation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting) for details.

#### Auto-generated Features

- **Table of Contents**: GitHub generates a dropdown TOC from headings
- **Heading anchors**: Stable links auto-generated from heading text
- **Note**: Changing headings breaks existing anchor links

## Spacing and Line Breaks

### Blank Lines

- **One blank line** between:
  - Sections (after headings)
  - Before and after code blocks
  - Before and after lists
  - Between paragraphs

- **No multiple blank lines**: Never use more than one consecutive blank line

### Line Length

- **Prose**: Consider keeping lines ≤ 120 characters for better diff readability (optional)
- **Never hard-wrap**: Headings or URLs (breaks functionality)
- **Exception**: Tables and code blocks may exceed normal width

### Trailing Spaces

- **Never use trailing spaces**: Clean line endings
- Configure your editor to show and remove trailing spaces

## File Naming

- **Uppercase for docs**: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`
- **Descriptive names**: Use clear, specific filenames

## Tool-Specific Documentation

- Each tool may extend these guidelines in its own `docs/MARKDOWN.md` file
- Tool-specific conventions should not conflict with these base rules
- Document any deviations clearly
