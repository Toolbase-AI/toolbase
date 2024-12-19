export type ServerConfig = {
  envVariables?: Record<string, string>;
  customArgs?: {
    [key: string]: string | string[];
  };
};

export type ServerConfigsRecord = Record<string, ServerConfig>;
