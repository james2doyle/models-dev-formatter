# AGENTS.md

Guidelines for AI agents working in this repository.

## Project Overview

A Bun-based TypeScript CLI tool that converts AI provider API data (from api.json) into various config formats: crush (JSON), goose (JSON), and vibe (TOML).

## Commands

### Development
```bash
# Download latest api.json from models.dev
bun run download

# Type check
bun run typecheck

# Format code with Biome
bun run format

# Run all tests
bun test

# Run specific test file
bun test src/convert.test.ts

# Run converter CLI
bun run convert <provider> --format <format>
# Example: bun run convert openai --format crush
```

## Code Style Guidelines

### Import Conventions
- Always include `.js` extension in imports: `import { foo } from "./bar.js"`
- Use `type` keyword for type imports: `import type { Foo } from "./types.js"`
- External dependencies first, then internal
- Biome organizes imports automatically (source.organizeImports is enabled)

### Formatting
- **Indentation**: Tabs (configured in biome.json)
- **Quotes**: Double quotes for strings
- **Semicolons**: Use semicolons
- Run `bun run format` before committing

### TypeScript Conventions
- **Target**: ESNext with ES modules
- **Strict mode**: Enabled
- **Return types**: Explicit return types on exported functions
- **Interfaces**: Prefer interfaces for object shapes (e.g., `FormatContext`, `CrushModel`)
- **Type literals**: Use `type` for simple unions (e.g., `extension: "json" | "toml"`)
- **Naming**:
  - PascalCase for interfaces/types
  - camelCase for functions, variables, and properties
  - SNAKE_CASE for environment variable names

### Code Organization
- Barrel exports via `index.ts` files
- Type definitions in dedicated `types.ts` files
- Format converters in separate files per format (e.g., `crush.ts`, `goose.ts`)
- Test files colocated with source as `.test.ts`

### Error Handling
- Throw descriptive errors for exceptional cases
- Check file existence before operations
- Use `process.exit(1)` for CLI error states
- Handle both Error instances and unknown error types:
  ```typescript
  console.error("Error:", error instanceof Error ? error.message : error);
  ```

### String Helpers
Common string transformation patterns used:
- `kebabCase`: lowercase with hyphens
- `lowerSnakeCase`: lowercase with underscores
- `toUpperSnake`: uppercase with underscores (for env vars)

### Testing
- Uses Bun's native test runner (`bun:test`)
- Import: `import { describe, it, expect } from "bun:test"`
- Group related tests with `describe()`
- Use descriptive test names explaining behavior
- Test actual conversion output by parsing and asserting structure

## Architecture

- `src/convert.ts` - Main CLI entry point
- `src/formats/` - Format converters
  - `types.ts` - Shared type definitions
  - `index.ts` - Converter registry and exports
  - `crush.ts`, `goose.ts`, `vibe.ts` - Individual format implementations
- `src/convert.test.ts` - Integration tests

## Key Dependencies

- `bun` - Runtime and package manager (v1.3.10)
- `@biomejs/biome` - Linting and formatting
- `models.dev` - Type definitions for Provider/Model
- `@types/bun` - Bun type definitions
