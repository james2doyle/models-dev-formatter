# models.dev-formatter

> Convert [models.dev](models.dev) API data into various configuration formats (crush, goose, vibe).

This tool is to help support models in different tools that otherwise make it more difficult to load up custom providers.

## Installation

```bash
bun install
```

## Usage

### Download API Data

Fetch the latest `api.json` from models.dev:

```bash
bun run download
```

### Convert Provider Data

```bash
bun run convert <provider> --format <format>
```

**Supported formats:**
- `crush` - JSON format for Crush configuration
- `goose` - JSON format for Goose AI configuration
- `vibe` - TOML format for Vibe configuration

**Examples:**

```bash
# Convert OpenAI to crush format
bun run convert openai --format crush

# Convert ZenMux to goose format
bun run convert zenmux --format goose

# Convert Hugging Face to vibe format
bun run convert huggingface --format vibe
```

## Development

```bash
# Type check
bun run typecheck

# Format code with Biome
bun run format

# Run tests
bun test
```

## Architecture

- `src/convert.ts` - Main CLI entry point
- `src/formats/` - Format converters
  - `crush.ts` - Crush JSON format
  - `goose.ts` - Goose JSON format
  - `vibe.ts` - Vibe TOML format
  - `types.ts` - Shared type definitions

## License

Private
