# Toolbase Desktop `packages/app`

The desktop application for Toolbase that provides an interface for managing tools and plugins for Claude Desktop and other AI platforms.

Toolbase Desktop is built with Electron.

## Development

### Prerequisites

- Node.js 22
- npm
- [Claude Desktop](https://claude.ai/download) installed

### Getting Started

> The desktop application requires the built runner from `packages/runner`. When running it locally or during the build process, the runner will be built and copied over to the `./bin` directory

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

### Project Structure

```
app/
├── src/
│   ├── main/           # Main process code
│   ├── preload/        # Preload scripts
│   ├── renderer/       # Renderer process code
│   ├── shared/         # Shared utilities
├── package.json
```

### Building

Before building, specific environment variables are required - check `.env.example` and create your own `.env` file

To build the application, run the following command:

```bash
npm run make
```

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run make

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run tc
```

## License

Apache 2.0 - see the [LICENSE](/LICENSE) file for details.
