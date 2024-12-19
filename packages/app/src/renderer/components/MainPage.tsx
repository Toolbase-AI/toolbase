import {
  ActionIcon,
  Anchor,
  AppShell,
  Box,
  Button,
  Flex,
  Group,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconBrandGithub, IconRefresh } from '@tabler/icons-react';
import { ColorModeButton } from './ColorModeButton';
import { Logo } from './Logo';
import { ServersGrid } from './ServersGrid';

export function MainPage() {
  const { colorScheme } = useMantineColorScheme();

  const handleRefresh = async () => {
    try {
      await window.electronAPI.refreshClaude();
    } catch (error) {
      console.error('Failed to refresh Claude:', error);
    }
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Logo />
          <Group>
            <ColorModeButton />
            <Button
              variant="light"
              onClick={handleRefresh}
              leftSection={<IconRefresh size={20} />}
            >
              Refresh Claude
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <ServersGrid />
      </AppShell.Main>
      <Box
        component="footer"
        py="sm"
        px="md"
        mt={12}
        style={{
          borderTop: `1px solid var(${colorScheme === 'light' ? '--mantine-color-gray-3' : '--mantine-color-dark-4'})`,
        }}
      >
        <Flex
          direction={{ base: 'column', xs: 'row' }}
          justify={{ base: 'center', xs: 'space-between' }}
          align="center"
          gap="md"
        >
          <Flex
            direction={{ base: 'column', xs: 'row' }}
            align="center"
            gap="xs"
          >
            <ActionIcon
              component="a"
              href="https://github.com/Toolbase-AI/toolbase/"
              target="_blank"
              variant="subtle"
              c="dimmed"
            >
              <IconBrandGithub size={20} />
            </ActionIcon>
            <Anchor
              href="https://gettoolbase.ai/terms"
              target="_blank"
              c="dimmed"
              size="xs"
            >
              Terms and Conditions
            </Anchor>
            <Anchor
              href="https://gettoolbase.ai/privacy"
              target="_blank"
              c="dimmed"
              size="xs"
            >
              Privacy Policy
            </Anchor>
            <Anchor
              href="https://github.com/Toolbase-AI/toolbase/blob/main/LICENSE"
              target="_blank"
              c="dimmed"
              size="xs"
            >
              License
            </Anchor>
          </Flex>
          <Text size="xs" c="dimmed">
            © 2024 Toolbase
          </Text>
        </Flex>
      </Box>
    </AppShell>
  );
}
