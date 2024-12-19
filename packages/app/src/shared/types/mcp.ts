export interface MCPServerConfig {
  command: string;
  args: string[];
  env: Record<string, string> | undefined;
}

export type MCPServersRecord = { [key: string]: MCPServerConfig };
