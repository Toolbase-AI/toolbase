import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { app } from 'electron';
import { type ServerConfig } from '../shared/types/servers';
import { getEsmUrl } from '../shared/utils';
import {
  CACHE_DIR_NAME,
  DEV_RUNNER_RELATIVE_PATH,
  HOME_SETTINGS_DIR_NAME,
  RUNNER_NAME,
} from './constants';

/**
 * Copies the local runner to the settings folder
 */
export async function copyLocalRunnerToSettings() {
  const homePath = app.getPath('home');
  const homeSettingsPath = path.join(homePath, HOME_SETTINGS_DIR_NAME);

  // Make settings folder if it doesn't exist
  await fs.mkdir(homeSettingsPath, { recursive: true });

  // Copy over the runner
  return fs.copyFile(getLocalRunnerPath(), getSettingsRunnerPath());
}

/**
 * Creates the runner config
 */
export function createRunnerConfig(
  modulePath: string,
  serverConfig?: ServerConfig,
) {
  return {
    command: getRunnerCommand(),
    args: createRunnerArgs(modulePath, serverConfig?.customArgs),
    env:
      Object.keys(serverConfig?.envVariables ?? {}).length === 0
        ? undefined
        : serverConfig!.envVariables,
  };
}

/**
 * Returns the command to run the MCP server using the toolbase runner.
 */
function getRunnerCommand() {
  // @important - We want to be able to always test the runner just like how it would behave in production
  // If you are developing locally and want to test the runner, you can uncomment the following lines.
  // In developement, use the local toolbase runner.
  //   if (!app.isPackaged) {
  //     return getLocalRunnerPath();
  //   }

  // In production, use the settings runner path
  return getSettingsRunnerPath();
}

/**
 * Returns the arguments to run the MCP server using the toolbase runner.
 * @todo - Pass in root for module cache
 * @todo - Allow for passing in arbitrary arguments
 * @param key
 */
function createRunnerArgs(
  modulePath: string,
  customArgs?: ServerConfig['customArgs'],
): string[] {
  if (!modulePath) {
    return [];
  }

  // Using the module path, generate esm.sh module URL module option to import from
  // We also opt to bundle dependencies and pin the esm.sh version.
  const moduleOption = `-m=${getEsmUrl(modulePath)}%3Fbundle-deps&pin=v135`;

  // Generate a root cache path for the runner
  const cachePath = getCachePath();
  const cacheOption = `-c=${cachePath}`;

  // Pass any additional custom arguments to the runner
  // @fixme - There is no order. Probably safer that underlying MCPs do better parsing for CLI commands.
  const allCustomArgs = Object.entries(customArgs ?? {}).reduce<string[]>(
    (acc, [, argValue]) => {
      if (typeof argValue === 'string') {
        return [...acc, argValue];
      }

      return [...acc, ...argValue];
    },
    ['--'],
  );

  // Pass to runner the correct option for the module.
  return [moduleOption, cacheOption, ...allCustomArgs];
}

function getSettingsRunnerPath() {
  return path.join(app.getPath('home'), HOME_SETTINGS_DIR_NAME, RUNNER_NAME);
}

function getCachePath() {
  return path.join(app.getPath('home'), HOME_SETTINGS_DIR_NAME, CACHE_DIR_NAME);
}

/**
 * Returns the local runner path thats packaged with the app
 * @returns
 */
function getLocalRunnerPath() {
  if (!app.isPackaged) {
    // During development, use the locally built toolbase runner.
    return path.resolve(DEV_RUNNER_RELATIVE_PATH);
  }
  return `${process.resourcesPath}/${RUNNER_NAME}`;
}
