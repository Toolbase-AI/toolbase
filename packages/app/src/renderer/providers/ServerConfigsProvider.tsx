import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  ServerConfig,
  ServerConfigsRecord,
} from '../../shared/types/servers';

interface ServerConfigsContextType {
  serverConfigs: ServerConfigsRecord;
  setServerConfig: (key: string, value: ServerConfig) => Promise<void>;
  loading: boolean;
  error: Error | undefined;
}

const ServerConfigsContext = createContext<
  ServerConfigsContextType | undefined
>(undefined);

// ServerConfigsProvider serves as storage for server configurations for specific MCP servers ie. environment variables
export function ServerConfigsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serverConfigs, setServerConfigs] = useState<ServerConfigsRecord>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    window.electronAPI.serverConfigs
      .getServerConfigs()
      .then(setServerConfigs)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // Subscribe to server config changes
    return window.electronAPI.serverConfigs.onServerConfigsChanged(
      (servers) => {
        setServerConfigs(servers);
        setError(undefined);
      },
    );
  }, []);

  const setServerConfig = async (key: string, value: ServerConfig) => {
    return window.electronAPI.serverConfigs.setServerConfig(key, value);
  };

  return (
    <ServerConfigsContext.Provider
      value={{
        serverConfigs,
        setServerConfig,
        loading,
        error,
      }}
    >
      {children}
    </ServerConfigsContext.Provider>
  );
}

export function useServerConfigs() {
  const context = useContext(ServerConfigsContext);
  if (context === undefined) {
    throw new Error(
      'useServerConfigs must be used within a ServerConfigsProvider',
    );
  }
  return context;
}
