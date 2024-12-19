import {
  ActionIcon,
  Anchor,
  Card,
  Flex,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import type { MCPServer } from '../types/types';
import { ServerSwitch } from './ServerSwitch';

interface ServerCardProps {
  server: MCPServer;
  onToggle: (serverId: string) => void;
  onTitleClick: (server: MCPServer) => void;
  onConfigure: (server: MCPServer) => void;
}

export function ServerCard({
  server,
  onToggle,
  onConfigure,
  onTitleClick,
}: ServerCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" h="100%" withBorder>
      <Flex direction="column" h="100%" gap="lg">
        <Stack style={{ flexGrow: 1 }} gap="xs" align="flex-start">
          <Anchor
            component="button"
            fw={500}
            size="lg"
            onClick={() => {
              onTitleClick(server);
            }}
          >
            {server.name}
          </Anchor>
          <Text size="sm" c="dimmed">
            {server.description}
          </Text>
        </Stack>
        <Group justify="space-between">
          <ActionIcon
            variant="light"
            onClick={() => {
              onConfigure(server);
            }}
            title="Configure server"
          >
            <IconSettings size={18} />
          </ActionIcon>
          <ServerSwitch server={server} onToggle={onToggle} />
        </Group>
      </Flex>
    </Card>
  );
}
