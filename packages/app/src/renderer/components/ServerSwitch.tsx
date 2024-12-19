import { Loader, Switch, Tooltip, type SwitchProps } from '@mantine/core';
import { useServerConfigs } from '../providers/ServerConfigsProvider';
import { type MCPServer } from '../types/types';

interface ServerSwitchProps extends SwitchProps {
  server: MCPServer;
  onToggle: (serverId: string) => void;
}

export function ServerSwitch({
  server,
  onToggle,
  ...props
}: ServerSwitchProps) {
  const { loading: isServerStoreLoading, serverConfigs } = useServerConfigs();

  const settings = serverConfigs[server.id];

  const hasRequiredEnvVariables = () => {
    if (!server.envVariables && !server.customArgs) {
      return true;
    }

    const requiredEnvVars = Object.entries(server.envVariables ?? {})
      .filter(([, config]) => config.required)
      .map(([key]) => key);

    const requiredCustomArgs = Object.entries(server.customArgs ?? {})
      .filter(([, config]) => config.required)
      .map(([key]) => key);

    if (requiredEnvVars.length === 0 && requiredCustomArgs.length === 0) {
      return true;
    }

    if (!settings) {
      return false;
    }

    return (
      requiredEnvVars.every((varName) => !!settings.envVariables?.[varName]) &&
      requiredCustomArgs.every((varName) => !!settings.customArgs?.[varName])
    );
  };

  const isConfigured = hasRequiredEnvVariables();

  let toggle = (
    <Switch
      size="lg"
      onLabel="ON"
      offLabel="OFF"
      checked={server.enabled}
      disabled={!isConfigured}
      onChange={() => onToggle(server.id)}
      {...props}
    />
  );

  if (isServerStoreLoading) {
    toggle = <Loader />;
  } else if (!isConfigured) {
    // TODO - Since this application stores different configurations from the Claude MCP configuration, we disable the switch completely
    // if the app does not have the required configuration
    // A smarter way is that we let users disable an enabled server even if we don't have the required configuration
    toggle = (
      <Tooltip
        label="Required settings must be configured to enable or disable this plugin"
        refProp="rootRef"
      >
        {toggle}
      </Tooltip>
    );
  }

  return toggle;
}
