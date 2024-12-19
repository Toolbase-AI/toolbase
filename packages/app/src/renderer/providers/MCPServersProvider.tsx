import React, { createContext, useContext, useEffect, useState } from 'react';
import type { MCPServersRecord } from '../../shared/types/mcp';

interface MCPServersContextType {
  mcpServers: MCPServersRecord;
  toggleServer: (key: string) => Promise<void>;
  deleteServer: (key: string) => Promise<void>;
  loading: boolean;
  error: Error | undefined;
}

const MCPServersContext = createContext<MCPServersContextType | undefined>(
  undefined,
);

// MCPServersProvider serves as storage for MCP servers currently configured on Claude
// The actions performed here will affect the configuration for Claude
export function MCPServersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mcpServers, setMCPServers] = useState<MCPServersRecord>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    window.electronAPI.mcpConfig
      .getServers()
      .then(setMCPServers)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // Subscribe to MCP server changes
    return window.electronAPI.mcpConfig.onServersChanged((servers) => {
      setMCPServers(servers);
      setError(undefined);
    });
  }, []);

  const toggleServer = async (key: string) => {
    const isEnabled = !!mcpServers[key];
    return window.electronAPI.mcpConfig.toggleServer(key, !isEnabled);
  };

  const deleteServer = async (key: string) => {
    return window.electronAPI.mcpConfig.deleteServer(key);
  };

  return (
    <MCPServersContext.Provider
      value={{
        mcpServers,
        toggleServer,
        deleteServer,
        loading,
        error,
      }}
    >
      {children}
    </MCPServersContext.Provider>
  );
}

export function useMCPServers() {
  const context = useContext(MCPServersContext);
  if (context === undefined) {
    throw new Error('useMCPServers must be used within a MCPServersProvider');
  }
  return context;
}
