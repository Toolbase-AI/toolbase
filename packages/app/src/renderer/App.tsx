import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainPage } from './components/MainPage';
import { MCPServersProvider } from './providers/MCPServersProvider';
import { ServerConfigsProvider } from './providers/ServerConfigsProvider';
import { theme } from './theme/theme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MCPServersProvider>
          <ServerConfigsProvider>
            <MainPage />
          </ServerConfigsProvider>
        </MCPServersProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
