# Toolbase Runner `packages/runner`

The runner is a Deno CLI and library that executes MCP servers locally to
provide tools and plugins to Claude Desktop and other AI platforms. This will be
built into a binary to run on the user's local devices.

## Development

### Prerequisites

- Deno 2

### Getting Started

```bash
# Run locally
deno task dev

# Build binary
deno task build
```

### Project Structure

```
runner/
├── out/               # Build output directory
├── mod.ts             # Main entry point
├── deno.json          # Deno configuration
```

### Available Tasks

```bash
# Run development version
deno task dev

# Build binary
deno task build

# Format code
deno fmt

# Lint code
deno lint
```

## License

Apache 2.0 - see the [LICENSE](/LICENSE) file for details.
