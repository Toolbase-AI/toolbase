import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorModeButton() {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();

  const title = colorScheme === 'dark' ? 'Light' : 'Dark';
  const icon =
    colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />;

  return (
    <ActionIcon
      variant="light"
      onClick={toggleColorScheme}
      title={title}
      size="lg"
    >
      {icon}
    </ActionIcon>
  );
}
