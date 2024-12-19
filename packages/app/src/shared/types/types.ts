export interface MCPPackage {
  id: string;
  name: string;
  description?: string;
  vendor?: string;
  sourceUrl?: string;
  homepage?: string;
  license?: string;
  envVariables?: {
    [key: string]: {
      title?: string;
      description: string;
      required: boolean;
    };
  };
  customArgs?: {
    [key: string]: {
      title?: string;
      description: string;
      required: boolean;
      type: 'folders' | 'strings' | 'string';
    };
  };
  /**
   * Module path is either the NPM Package Name, including the path to the main module if their isn't one or Github repo org/name/path/to/file
   */
  modulePath: string;
  readmePath?: string;
}
