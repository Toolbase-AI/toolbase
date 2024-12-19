import { exec } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerZIP } from '@electron-forge/maker-zip';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

// function getRunnerTarget (platform: string, arch: string) => {
//   if (platform === 'darwin') {
//     if (arch === 'arm64') {
//       return 'aarch64-apple-darwin';
//     } else if (arch === 'x64') {
//       return 'x86_64-apple-darwin';
//     } else {
//       throw new Error(`Unsupported architecture: ${arch}`);
//     }
//   } else {
//     throw new Error(`Unsupported platform: ${platform}`);
//   }
// };

function execAsync(
  command: string,
  dir: string,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: dir }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Get runner build path
const binRunnerBinaryPath = path.join(__dirname, 'bin/toolbase-runner');
const runnerPackageDirPath = path.join(__dirname, '../runner');
const runnerPackageBinaryPath = path.join(
  runnerPackageDirPath,
  `out/toolbase-runner`,
);

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './icons/icon',
    // Include the runner binary
    extraResource: ['./bin/toolbase-runner'],
    osxSign: {
      identity: process.env.APPLE_IDENTITY,
    },
    osxNotarize: {
      appleId: process.env.APPLE_ID ?? '',
      appleIdPassword: process.env.APPLE_ID_PASSWORD ?? '',
      teamId: process.env.APPLE_TEAM_ID ?? '',
    },
  },
  hooks: {
    async generateAssets() {
      // @important - This does some smart logic of only rebuilding the runner if necessary, but feels like it could cause lots of headaches.
      // toolbase-runner exists in bin/
      // if (fs.existsSync(binRunnerBinaryPath)) {
      //   console.log('"./bin/toolbase-runner" already exists. Skipping build.');
      //   return;
      // }

      // console.warn(
      //   '"./bin/toolbase-runner" not found. Building and copying the runner from "packages/runner"',
      // );

      // Create the bin/ directory
      // if (!fs.existsSync(path.dirname(binRunnerBinaryPath))) {
      //   fs.mkdirSync(path.dirname(binRunnerBinaryPath), { recursive: true });
      //   console.log(`Created directory: ${path.dirname(binRunnerBinaryPath)}`);
      // }

      // Binary already exists, copy it over
      // if (fs.existsSync(runnerPackageBinaryPath)) {
      //   fs.copyFileSync(runnerPackageBinaryPath, binRunnerBinaryPath);
      //   console.log(
      //     `Copied "toolbase-runner" from "${runnerPackageBinaryPath}" to "${binRunnerBinaryPath}"`,
      //   );
      //   return;
      // }

      // Create it if it doesn't exist
      fs.mkdirSync(path.dirname(binRunnerBinaryPath), { recursive: true });

      // Build on demand for the target platform and architecture and copy
      await execAsync('deno task build', runnerPackageDirPath);
      fs.copyFileSync(runnerPackageBinaryPath, binRunnerBinaryPath);

      console.log(
        `Built and copied "toolbase-runner" from "${runnerPackageBinaryPath}" to "${binRunnerBinaryPath}"`,
      );
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP({}, ['darwin']),
    //@ts-expect-error MakerDMS has incorrect types.
    new MakerDMG({
      overwrite: true,
      icon: './icons/icon.icns',
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
