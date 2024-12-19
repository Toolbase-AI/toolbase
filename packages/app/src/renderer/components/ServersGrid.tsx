import { Grid } from '@mantine/core';
import { useEffect, useState } from 'react';
import { packages } from '../../shared/packages';
import { useMCPServers } from '../providers/MCPServersProvider';
import { type MCPServer } from '../types/types';
import { EditModal } from './EditModal';
import { ServerCard } from './ServerCard';
import { ServerInfoModal } from './ServerInfoModal';

export function ServersGrid() {
  const { mcpServers, toggleServer } = useMCPServers();

  const [servers, setServers] = useState<MCPServer[]>(
    packages.map((pack) => ({
      ...pack,
      id: pack.id,
      enabled: !!mcpServers[pack.id],
    })),
  );

  const [editServer, setEditServer] = useState<MCPServer>();
  const [focusedServer, setFocusedServer] = useState<MCPServer>();

  useEffect(() => {
    // On updates, update the enabled state
    setServers((servers) => {
      return servers.map((server) => {
        return {
          ...server,
          enabled: !!mcpServers[server.id],
        };
      });
    });
  }, [mcpServers]);

  const handleToggleServer = async (serverId: string) => {
    return toggleServer(serverId);
  };

  return (
    <Grid gutter="md">
      {editServer && (
        <EditModal
          centered
          server={editServer}
          opened={!!editServer}
          onClose={() => setEditServer(undefined)}
        />
      )}
      {focusedServer && (
        <ServerInfoModal
          centered
          server={focusedServer}
          opened={!!focusedServer}
          onClose={() => setFocusedServer(undefined)}
        />
      )}
      {servers.map((server) => (
        <Grid.Col key={server.id} span={{ base: 12, sm: 6, md: 4 }}>
          <ServerCard
            server={server}
            onToggle={handleToggleServer}
            onConfigure={(curr) => setEditServer(curr)}
            onTitleClick={(curr) => setFocusedServer(curr)}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
}
