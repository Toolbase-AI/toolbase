import type { MCPServerConfig, MCPServersRecord } from '../shared/types/mcp';
import type {
  ServerConfig,
  ServerConfigsRecord,
} from '../shared/types/servers';

export interface ElectronAPI {
  refreshClaude: () => Promise<void>;
  openDirectories: () => Promise<string[]>;
  serverConfigs: {
    getServerConfigs: () => Promise<ServerConfigsRecord>;
    setServerConfig: (serverId: string, value: ServerConfig) => Promise<void>;
    onServerConfigsChanged: (
      callback: (servers: ServerConfigsRecord) => void,
    ) => () => void;
  };
  mcpConfig: {
    getServers: () => Promise<MCPServersRecord>;
    updateServer: (key: string, config: MCPServerConfig) => Promise<void>;
    deleteServer: (key: string) => Promise<void>;
    toggleServer: (key: string, enabled: boolean) => Promise<void>;
    onServersChanged: (
      callback: (servers: MCPServersRecord) => void,
    ) => () => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
