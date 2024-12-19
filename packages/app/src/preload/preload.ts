// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import type {
  ServerConfig,
  ServerConfigsRecord,
} from 'src/shared/types/servers';
import type { MCPServerConfig, MCPServersRecord } from '../shared/types/mcp';

contextBridge.exposeInMainWorld('electronAPI', {
  refreshClaude: () => ipcRenderer.invoke('refreshClaude'),
  openDirectories: () => ipcRenderer.invoke('openDirectories'),
  serverConfigs: {
    getServerConfigs: (serverId: string) =>
      ipcRenderer.invoke('getServerConfigs', serverId),
    setServerConfig: (serverId: string, value: ServerConfig) =>
      ipcRenderer.invoke('setServerConfig', serverId, value),
    onServerConfigsChanged: (
      callback: (servers: ServerConfigsRecord) => void,
    ) => {
      const subscription = (
        _event: Electron.IpcRendererEvent,
        servers: ServerConfigsRecord,
      ) => {
        callback(servers);
      };
      ipcRenderer.on('serversConfigChanged', subscription);
      return () => {
        ipcRenderer.removeListener('serversConfigChanged', subscription);
      };
    },
  },
  mcpConfig: {
    getServers: () => ipcRenderer.invoke('getMCPServers'),
    updateServer: (key: string, config: MCPServerConfig) =>
      ipcRenderer.invoke('updateMCPServer', key, config),
    deleteServer: (key: string) => ipcRenderer.invoke('deleteMCPServer', key),
    toggleServer: (key: string, enabled: boolean) =>
      ipcRenderer.invoke('toggleMCPServer', key, enabled),
    onServersChanged: (callback: (servers: MCPServersRecord) => void) => {
      const subscription = (
        _event: Electron.IpcRendererEvent,
        servers: MCPServersRecord,
      ) => {
        callback(servers);
      };
      ipcRenderer.on('mcpServersChanged', subscription);
      return () => {
        ipcRenderer.removeListener('mcpServersChanged', subscription);
      };
    },
  },
});
