import { type MCPPackage } from './types/types';

export const packages: MCPPackage[] = [
  {
    id: '@modelcontextprotocol-server-filesystem',
    modulePath: '@modelcontextprotocol/server-filesystem@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-filesystem@0.6.2/README.md',
    envVariables: {},
    customArgs: {
      files: {
        title: 'Folders',
        description: 'List of folders to read',
        type: 'folders',
        required: true,
      },
    },
    name: 'Filesystem',
    description: 'Access and read files from your computer',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/filesystem',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },
  {
    id: '@kimtaeyoon83-mcp-server-youtube-transcript',
    modulePath:
      '@kimtaeyoon83/mcp-server-youtube-transcript@0.1.1/dist/index.js',
    readmePath: '@kimtaeyoon83/mcp-server-youtube-transcript@0.1.1/README.md',
    envVariables: {},
    name: 'Youtube Transcript',
    description: 'Download and read transcripts from YouTube videos',
    vendor: 'Freddie',
    sourceUrl: 'https://github.com/kimtaeyoon83/mcp-server-youtube-transcript',
    homepage: 'https://github.com/kimtaeyoon83',
    license: 'MIT',
  },
  {
    id: '@calclavia-mcp-obsidian',
    modulePath: 'mcp-obsidian@1.0.0/dist/index.js',
    readmePath: 'mcp-obsidian@1.0.0/README.md',
    envVariables: {},
    customArgs: {
      vaults: {
        title: 'Obsidian Vault and Markdown Folders',
        description: 'Your Obsidian vault folders',
        type: 'folders',
        required: true,
      },
    },
    name: 'Obsidian and Markdown',
    description:
      'Read and search through your Obsidian notes, vaults and markdown files',
    vendor: 'Smithery',
    sourceUrl: 'https://github.com/smithery-ai/mcp-obsidian',
    homepage: 'https://github.com/smithery-ai',
    license: 'MIT',
  },
  {
    id: '@mcp-get-community-server-curl',
    modulePath: '@mcp-get-community/server-curl@0.1.0/dist/index.js',
    readmePath: '@mcp-get-community/server-curl@0.1.0/README.md',
    envVariables: {},
    name: 'Curl',
    description: 'Make HTTP requests to any website or API',
    vendor: 'Michael Latman',
    sourceUrl:
      'https://github.com/mcp-get/community-servers/blob/main/src/server-curl',
    homepage: 'https://michaellatman.com',
    license: 'MIT',
  },
  {
    id: '@mcp-get-community-server-macos',
    modulePath: '@mcp-get-community/server-macos@0.1.0/dist/index.js',
    readmePath: '@mcp-get-community/server-macos@0.1.0/README.md',
    envVariables: {},
    name: 'macOS Server',
    description: 'Interact with macOS system features',
    vendor: 'Michael Latman',
    sourceUrl:
      'https://github.com/mcp-get/community-servers/blob/main/src/server-macos',
    homepage: 'https://michaellatman.com',
    license: 'MIT',
  },
  {
    id: '@modelcontextprotocol-server-brave-search',
    modulePath: '@modelcontextprotocol/server-brave-search@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-brave-search@0.6.2/README.md',
    envVariables: {
      BRAVE_API_KEY: {
        description: 'API key for Brave Search',
        required: true,
      },
    },
    name: 'Brave Search',
    description: 'Search the web using Brave Search',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/brave-search',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },

  {
    id: '@exa-mcp-server',
    modulePath: 'gh/exa-labs/exa-mcp-server@27cee5d0e2/src/index.ts',
    readmePath: 'gh/exa-labs/exa-mcp-server@27cee5d0e2/README.md',
    envVariables: {
      EXA_API_KEY: {
        title: 'Exa API Key',
        description: 'API key for Exa AI Search',
        required: true,
      },
    },
    name: 'Exa AI Search',
    description: 'Search through web content using Exa AI',
    vendor: 'Exa Labs',
    sourceUrl: 'https://github.com/exa-labs/exa-mcp-server',
    homepage: 'https://exa.ai',
    license: 'MIT',
  },
  {
    id: '@search1api-mcp-server',
    modulePath: 'search1api-mcp@0.1.3/dist/index.js',
    readmePath: 'search1api-mcp@0.1.3/README.md',
    envVariables: {
      SEARCH1API_KEY: {
        title: 'Search1API API Key',
        description: 'API key for Search1API',
        required: true,
      },
    },
    name: 'Search1API',
    description: 'Search the web using Search1API',
    vendor: 'fatwang2',
    sourceUrl: 'https://github.com/fatwang2/search1api-mcp',
    homepage: 'https://github.com/fatwang2/',
    license: 'MIT',
  },
  {
    id: '@kagi-mcp-server-kagi',
    modulePath: 'gh/ac3xx/mcp-servers-kagi@c63b11ff5d/src/index.ts',
    readmePath: 'gh/ac3xx/mcp-servers-kagi@c63b11ff5d/README.md',
    envVariables: {
      KAGI_API_KEY: {
        title: 'Kagi API Key',
        description: 'API key for Kagi Search',
        required: true,
      },
    },
    name: 'Kagi Search',
    description: 'Search the web using Kagi search engine',
    vendor: 'ac3xx',
    sourceUrl: 'https://github.com/ac3xx/mcp-servers-kagi',
    homepage: 'https://kagi.com/',
    license: 'MIT',
  },
  {
    id: '@modelcontextprotocol-server-github',
    modulePath: '@modelcontextprotocol/server-github@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-github@0.6.2/README.md',
    envVariables: {
      GITHUB_PERSONAL_ACCESS_TOKEN: {
        title: 'GitHub Personal Access Token',
        description: 'Personal access token for GitHub API access',
        required: true,
      },
    },
    name: 'GitHub',
    description: 'Access and manage GitHub repositories and issues',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/github',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },
  {
    id: '@modelcontextprotocol-server-gitlab',
    modulePath: '@modelcontextprotocol/server-gitlab@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-gitlab@0.6.2/README.md',
    envVariables: {
      GITLAB_PERSONAL_ACCESS_TOKEN: {
        title: 'GitLab Personal Access Token',
        description: 'Personal access token for GitLab API access',
        required: true,
      },
      GITLAB_API_URL: {
        title: 'GitLab API URL',
        description: 'GitLab API URL (optional, for self-hosted instances)',
        required: false,
      },
    },
    name: 'GitLab',
    description: 'Access and manage GitLab repositories and issues',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/gitlab',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },
  {
    id: '@modelcontextprotocol-server-google-maps',
    modulePath: '@modelcontextprotocol/server-google-maps@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-google-maps@0.6.2/README.md',
    envVariables: {
      GOOGLE_MAPS_API_KEY: {
        title: 'Google Maps API Key',
        description: 'API key for Google Maps services',
        required: true,
      },
    },
    name: 'Google Maps',
    description:
      'Find places, get directions, and access location data using Google Maps',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/google-maps',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },

  {
    id: '@modelcontextprotocol-server-postgres',
    modulePath: '@modelcontextprotocol/server-postgres@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-postgres@0.6.2/README.md',
    envVariables: {},
    customArgs: {
      connectionString: {
        title: 'PostgreSQL Connection String',
        description:
          'Local PostgreSQL connection string including the database name',
        type: 'string',
        required: true,
      },
    },
    name: 'PostgreSQL',
    description: 'Connect to and query PostgreSQL databases',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/postgres',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },

  {
    id: '@modelcontextprotocol-server-slack',
    modulePath: '@modelcontextprotocol/server-slack@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-slack@0.6.2/README.md',
    envVariables: {
      SLACK_BOT_TOKEN: {
        title: 'Slack Bot Token',
        description: 'Slack Bot User OAuth Token (starts with xoxb-)',
        required: true,
      },
      SLACK_TEAM_ID: {
        title: 'Slack Team ID',
        description: 'Slack Team/Workspace ID',
        required: true,
      },
    },
    name: 'Slack',
    description: 'Send and receive messages in Slack channels and DMs',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/slack',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },
  {
    id: '@modelcontextprotocol-server-sequential-thinking',
    modulePath:
      '@modelcontextprotocol/server-sequential-thinking@0.6.2/dist/index.js',
    readmePath:
      '@modelcontextprotocol/server-sequential-thinking@0.6.2/README.md',
    envVariables: {},
    name: 'Sequential Thinking',
    description: 'Break down complex problems into smaller, manageable steps',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/sequentialthinking',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },
  {
    id: 'mcp-mongo-server',
    modulePath: 'mcp-mongo-server@0.1.2/build/index.js',
    readmePath: 'mcp-mongo-server@0.1.2/README.md',
    envVariables: {},
    customArgs: {
      connectionString: {
        title: 'MongoDB Connection String',
        description:
          'Local MongoDB connection string including the database name',
        type: 'string',
        required: true,
      },
    },
    name: 'Mongo',
    description: 'Connect to and query MongoDB databases',
    vendor: 'Muhammed Kılıç',
    sourceUrl: 'https://github.com/kiliczsh/mcp-mongo-server',
    homepage: 'https://github.com/kiliczsh',
    license: 'MIT',
  },
  {
    id: '@modelcontextprotocol-server-everything',
    modulePath: '@modelcontextprotocol/server-everything@0.6.2/dist/index.js',
    readmePath: '@modelcontextprotocol/server-everything@0.6.2/README.md',
    envVariables: {},
    name: 'Everything',
    description:
      'Try out different features and capabilities of Claude MCP Plugins',
    vendor: 'Anthropic',
    sourceUrl:
      'https://github.com/modelcontextprotocol/servers/blob/main/src/everything',
    homepage: 'https://anthropic.com',
    license: 'MIT',
  },
];
