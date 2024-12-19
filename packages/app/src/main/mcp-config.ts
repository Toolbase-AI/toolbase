import * as os from 'os';
import * as path from 'path';
import Conf from 'conf';
import { packages } from '../shared/packages';
import type { MCPServerConfig, MCPServersRecord } from '../shared/types/mcp';
import { createRunnerConfig } from './runner-utils';
import { getServerConfig } from './servers-config';

interface MCPConfig {
  mcpServers: MCPServersRecord;
}

/**
 * Get the platform-specific path to the Claude config directory
 *
 */
function getClaudeConfigPath(): string {
  const platform = process.platform;

  switch (platform) {
    case 'darwin': // macOS
      return path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'Claude',
      );
    case 'win32': // Windows
      return path.join(os.homedir(), 'AppData', 'Roaming', 'Claude');
    case 'linux':
      return path.join(os.homedir(), '.config', 'claude');

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Configuration store for MCP servers
 *
 */
export const mcpStore = new Conf<MCPConfig>({
  cwd: getClaudeConfigPath(),

  configName: 'claude_desktop_config',

  fileExtension: 'json',
  defaults: {
    mcpServers: {},
  },
});

/**
 * Get all MCP server configurations
 *
 */
export function getMCPServers(): Record<string, MCPServerConfig> {
  return mcpStore.get('mcpServers');
}

/**
 * Get a specific MCP server configuration
 *
 */
export function getMCPServer(serverKey: string): MCPServerConfig | undefined {
  return mcpStore.get(`mcpServers.${serverKey}`);
}

/**
 * Update a specific MCP server configuration
 *
 */
export function updateMCPServer(
  serverKey: string,
  config: MCPServerConfig,
): void {
  mcpStore.set(`mcpServers.${serverKey}`, config);
}

export function updateMCPServerWithConfiguration(key: string) {
  const mcpPackage = packages.find((p) => p.id === key);
  const serverConfig = getServerConfig(key);

  if (!mcpPackage) {
    throw new Error(`Package not found: ${key}`);
  }

  updateMCPServer(key, createRunnerConfig(mcpPackage.modulePath, serverConfig));
}

/**
 * Delete a specific MCP server configuration
 *
 */
export function deleteMCPServer(serverKey: string): void {
  mcpStore.delete(`mcpServers.${serverKey}`);
}

/**
 * Toggle a specific MCP server configuration
 *
 */
export function toggleServer(key: string, enabled: boolean) {
  const mcpPackage = packages.find((p) => p.id === key);

  if (!mcpPackage) {
    throw new Error(`Package not found: ${key}`);
  }

  if (enabled) {
    updateMCPServerWithConfiguration(key);
  } else {
    // Disable server by removing it
    deleteMCPServer(key);
  }
}

/**
 * Watch for changes to the MCP configuration
 *
 * @param callback Function to call when configuration changes
 *
 * @returns Unsubscribe function
 */
export function watchMCPConfig(
  callback: (newValue: MCPConfig) => void,
): () => void {
  return mcpStore.onDidChange('mcpServers', (newValue) => {
    if (newValue) {
      callback({ mcpServers: newValue });
    }
  });
}
