> ⚠️ We’re currently in the process of updating the open-source Toolbase repository to reflect our latest changes after testing with alpha testers.

# Toolbase

<img width="1392" alt="app" src="https://github.com/user-attachments/assets/d60edc11-cabb-49c8-ba52-1a1418a9ebea" />

Toolbase is a desktop application that makes it easy to add tools and plugins to Claude and AI Platforms. It provides a simple interface for discovering, installing, and managing tools without requiring technical expertise.

Learn more at [https://gettoolbase.ai](https://gettoolbase.ai)

Powered by the [Model Context Protocol (MCP)](https://modelcontextprotocol.io)

> ⚠️ **Developer Preview**: This project is currently in active development. APIs and features may change without notice.

## Features

- 🔍 Visual tool browser
- 🚀 One-click tool installation
- 🔧 Simple configuration management
- 🔌 Seamless Claude Desktop integration

## Getting Started

### Prerequisites
- [Claude Desktop](https://claude.ai/download) installed

### Download and Run Toolbase
> Toolbase currently only supports macOS. Support for Windows and Linux in active development.

1. Download the latest version of Toolbase from [https://gettoolbase.ai](https://gettoolbase.ai)
2. Open the application and start using tools and plugins with Claude Desktop

## Project Structure

```
toolbase/
├── packages/
   ├── app/      # Desktop application for tool management
   └── runner/   # Secure local runner for MCP servers

```

This monorepo contains two main packages:

- `packages/app` - Desktop application for tool management and configuration, built with Electron
- `packages/runner` - Local runner for executing MCP servers and tools, built with Deno

See individual package READMEs for detailed documentation:

- [Desktop App Documentation](packages/app/README.md)
- [Runner Documentation](packages/runner/README.md)

## Development Setup

Although setup as a monorepo, each package are managed independently.

Clone the repository:
```bash
git clone https://github.com/Toolbase-AI/toolbase.git
cd toolbase
```

### Desktop App (`packages/app`)

The desktop application is built with Electron and provides the main user interface.

- [Desktop App Documentation](packages/app/README.md)

#### Prequisites
- Node 22
- npm

```bash
cd packages/app
npm install

# Run the Electron development application
npm start
```

### Runner (`packages/runner`)

The runner is a Deno CLI and library that executes MCP servers locally to provide tools and plugins to Claude Desktop and other AI platforms. This will be built into a binary to run on the user's local devices. 

- [Runner Documentation](packages/runner/README.md)

#### Prequisites
- Deno 2

```bash
cd packages/runner

# Run locally
deno task dev [OPTIONS]

# Build binary
deno task build
```

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Website](https://gettoolbase.ai)
- 📧 [Email Support](mailto:dev@gettoolbase.ai)

## Acknowledgments

- Built for enhancing [Claude Desktop](https://claude.ai)
- Uses the [Model Context Protocol](https://modelcontextprotocol.io)
- Inspired by the MCP community
