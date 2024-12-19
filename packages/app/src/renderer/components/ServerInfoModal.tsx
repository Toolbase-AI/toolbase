import {
  Anchor,
  Button,
  Container,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconBrandGithub, IconUser } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getEsmUrl } from '../../shared/utils';
import { type MCPServer } from '../types/types';

interface ServerInfoModalProps {
  server: MCPServer;
  opened: boolean;
  onClose: () => void;
  centered?: boolean;
}

export function ServerInfoModal({
  server,
  opened,
  onClose,
  centered,
}: ServerInfoModalProps) {
  const readme = useQuery({
    queryKey: [server.readmePath],
    queryFn: async () => {
      if (!server.readmePath) {
        throw new Error('No readme found for this plugin.');
      }

      const resp = await fetch(getEsmUrl(server.readmePath));

      if (!resp.ok) {
        throw new Error(`Failed to fetch ${server.readmePath}`);
      }

      return resp.text();
    },
  });

  return (
    <Modal
      fullScreen
      opened={opened}
      onClose={onClose}
      centered={centered}
      title={
        <Container>
          <Stack gap={6}>
            <Group>
              <Title order={5}>{server.name}</Title>
              <Button
                component="a"
                href={server.homepage}
                target="_blank"
                variant="subtle"
                leftSection={<IconUser size={14} />}
                size="xs"
              >
                {server.vendor}
              </Button>
              <Button
                component="a"
                href={server.sourceUrl}
                target="_blank"
                variant="subtle"
                leftSection={<IconBrandGithub size={14} />}
                size="xs"
              >
                GitHub
              </Button>
            </Group>
            <Text size="xs">{server.description}</Text>
          </Stack>
        </Container>
      }
      radius={0}
      transitionProps={{
        transition: 'fade',
        duration: 300,
        timingFunction: 'linear',
      }}
    >
      <Container fluid>
        {readme.isPending && (
          <>
            <Skeleton height="100px" mt={6} radius="md" />
            <Skeleton height="100px" mt={6} radius="md" />
            <Skeleton height="100px" mt={6} radius="md" />
            <Skeleton height="100px" mt={6} radius="md" />
            <Skeleton height="100px" mt={6} radius="md" />
          </>
        )}
        {readme.isError && (
          <Text>No information available for this plugin.</Text>
        )}
        {!!readme.data && (
          <TypographyStylesProvider>
            <Markdown
              remarkPlugins={[remarkGfm]}
              skipHtml
              components={{
                a(props) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { node, ref, ...rest } = props;
                  return <Anchor {...rest} target="_blank" />;
                },
              }}
            >
              {readme.data}
            </Markdown>
          </TypographyStylesProvider>
        )}
      </Container>
    </Modal>
  );
}
