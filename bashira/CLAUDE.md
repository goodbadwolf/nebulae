# Bashira Development Guide

This guide extends @../CLAUDE.md with Bashira-specific guidelines.

## Best Practices

- Always quote variables to handle paths with spaces
- Use `local` for function variables
- Return meaningful exit codes (0 for success, non-zero for failure)
- Source only the utilities you need to keep scripts lightweight

## Adding New Utilities

When adding new functions:

- Group related functions together
- Add clear documentation comments
- Use consistent naming patterns
- Test with various edge cases (spaces in paths, symlinks, etc.)
- Follow the existing code style

## Function Documentation

Each function should have:
- A comment describing what it does
- Usage example in a comment
- Parameter descriptions
- Return value description
- Exit codes if applicable

## Testing Guidelines

Test functions with:
- Paths containing spaces
- Symbolic links
- Non-existent paths
- Root directory edge cases
- Empty strings and null values

See @README.md for usage information and available utilities.