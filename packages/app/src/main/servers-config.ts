/**
 * Stores the configuration for individual servers - ie. environment variables
 */
import Store from 'electron-store';
import type {
  ServerConfig,
  ServerConfigsRecord,
} from '../shared/types/servers';
import { getMCPServer, updateMCPServerWithConfiguration } from './mcp-config';

interface ServerStoreSchema {
  servers: ServerConfigsRecord;
}

const serverStore = new Store<ServerStoreSchema>({
  name: 'server-configs',
  defaults: {
    servers: {},
  },
});

export function getServerConfigs(): ServerConfigsRecord | undefined {
  return serverStore.get('servers');
}

/**
 * Get server configuration for a specific server
 */
export function getServerConfig(serverId: string): ServerConfig | undefined {
  const servers = serverStore.get('servers');
  return servers[serverId];
}

/**
 * Update server configuration for a specific server
 */
export function setServerConfig(serverId: string, value: ServerConfig): void {
  const servers = serverStore.get('servers');
  servers[serverId] = value;
  serverStore.set('servers', servers);

  const mcpServer = getMCPServer(serverId);

  // Update MCP server if it exists / enabled.
  if (mcpServer) {
    updateMCPServerWithConfiguration(serverId);
  }
}

/**
 * Watch for changes to the server store
 * @param callback Function to call when configuration changes
 * @returns Unsubscribe function
 */
export function watchServersConfig(
  callback: (newValue: ServerStoreSchema) => void,
): () => void {
  return serverStore.onDidChange('servers', (newValue) => {
    if (newValue) {
      callback({ servers: newValue });
    }
  });
}
