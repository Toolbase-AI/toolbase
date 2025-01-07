import { exec } from 'child_process';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import type { MCPServerConfig } from '../shared/types/mcp';
import type { ServerConfig } from '../shared/types/servers';
import {
  deleteMCPServer,
  getMCPServers,
  toggleServer,
  updateMCPServer,
  watchMCPConfig,
} from './mcp-config';
import {
  getServerConfigs,
  setServerConfig,
  watchServersConfig,
} from './servers-config';

function execAsync(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function refreshClaude() {
  const platform = process.platform;

  try {
    if (platform === 'win32') {
      await execAsync('taskkill /F /IM "Claude.exe"');
    } else if (platform === 'darwin') {
      await execAsync('killall "Claude"');
    } else if (platform === 'linux') {
      await execAsync('pkill -f "claude"');
    }
  } catch (error) {
    console.error('Failed to close Claude, assuming it is not running', error);
  }

  // Wait a moment for the app to close before reopening
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Reopen the app
  try {
    if (platform === 'win32') {
      await execAsync('start "" "%LocalAppData%\\AnthropicClaude\\Claude.exe"');
    } else if (platform === 'darwin') {
      await execAsync('open -a "Claude"');
    } else if (platform === 'linux') {
      await execAsync('claude');
    }
  } catch (error) {
    console.error('Failed to open Claude', error);
  }
 
}

/**
 * Returns all paths of opened directories.
 */
async function openDirectories(window?: BrowserWindow): Promise<string[]> {
  const result = await (window
    ? dialog.showOpenDialog(window, {
        properties: [
          'openDirectory',
          'multiSelections',
          'multiSelections',
          'treatPackageAsDirectory',
        ],
      })
    : dialog.showOpenDialog({
        properties: [
          'openDirectory',
          'multiSelections',
          'multiSelections',
          'treatPackageAsDirectory',
        ],
      }));

  return result.filePaths;
}

export function setupIPCListeners() {
  // Claude refresh
  ipcMain.handle('refreshClaude', async () => {
    await refreshClaude();
  });

  ipcMain.handle('openDirectories', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender) ?? undefined;
    return openDirectories(window);
  });

  // Servers Config
  ipcMain.handle('getServerConfigs', () => {
    return getServerConfigs();
  });

  ipcMain.handle(
    'setServerConfig',
    (_event, serverId: string, value: ServerConfig) => {
      setServerConfig(serverId, value);
    },
  );

  watchServersConfig((newConfig) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('serversConfigChanged', newConfig.servers);
    });
  });

  // MCP Servers
  ipcMain.handle('getMCPServers', () => {
    return getMCPServers();
  });

  ipcMain.handle(
    'updateMCPServer',
    (_event, serverKey: string, config: MCPServerConfig) => {
      updateMCPServer(serverKey, config);
    },
  );

  ipcMain.handle('deleteMCPServer', (_event, serverKey: string) => {
    deleteMCPServer(serverKey);
  });

  ipcMain.handle('toggleMCPServer', (_event, key: string, enabled: boolean) => {
    toggleServer(key, enabled);
  });

  // Watch for MCP config changes and notify renderer
  watchMCPConfig((newConfig) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('mcpServersChanged', newConfig.mcpServers);
    });
  });

  // App quit
  ipcMain.handle('quit-app', () => {
    app.quit();
  });
}
