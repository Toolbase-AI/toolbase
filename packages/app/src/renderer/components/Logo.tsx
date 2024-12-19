import { useMantineColorScheme } from '@mantine/core';
import logoDark from '../assets/logoDark.svg';
import logoLight from '../assets/logoLight.svg';

export function Logo() {
  const { colorScheme } = useMantineColorScheme();
  const logo = colorScheme === 'dark' ? logoDark : logoLight;

  return <img src={logo} alt="Toolbase Logo" height={40} />;
}
