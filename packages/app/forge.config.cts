import { exec } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { PublisherGithub } from '@electron-forge/publisher-github';
import { type ForgeConfig } from '@electron-forge/shared-types';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { type TargetPlatform } from '@electron/packager';

const runnerPackageDirPath = path.join(__dirname, '../runner');

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

function getRunnerPaths(platform: TargetPlatform) {
  switch (platform) {
    case 'darwin':
    case 'mas':
    case 'linux':
      return {
        binLocalRunnerRelativePath: './bin/toolbase-runner',
        binRunnerBinaryPath: path.join(__dirname, 'bin/toolbase-runner'),
        runnerPackageBinaryPath: path.join(
          runnerPackageDirPath,
          `out/toolbase-runner`,
        ),
      };
    case 'win32':
      return {
        binLocalRunnerRelativePath: './bin/toolbase-runner.exe',
        binRunnerBinaryPath: path.join(__dirname, 'bin/toolbase-runner.exe'),
        runnerPackageBinaryPath: path.join(
          runnerPackageDirPath,
          `out/toolbase-runner.exe`,
        ),
      };
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './icons/icon',
    // Include the runner binary
    // extraResource: ['./bin/toolbase-runner', './bin/toolbase-runner.exe'],
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
    async generateAssets(config, platform, arch) {
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

      const {
        binLocalRunnerRelativePath,
        binRunnerBinaryPath,
        runnerPackageBinaryPath,
      } = getRunnerPaths(platform);

      // Create it if it doesn't exist
      fs.mkdirSync(path.dirname(binRunnerBinaryPath), { recursive: true });

      // Build on demand for the target platform and architecture and copy
      const { stdout, stderr } = await execAsync(
        `deno task build -p ${platform} -a ${arch}`,
        runnerPackageDirPath,
      );

      console.log(stdout, stderr);

      fs.copyFileSync(runnerPackageBinaryPath, binRunnerBinaryPath);

      console.log(
        `Built and copied "toolbase-runner" from "${runnerPackageBinaryPath}" to "${binRunnerBinaryPath} for ${platform}-${arch}"`,
      );

      // Add to our config
      config.packagerConfig.extraResource = [binLocalRunnerRelativePath];
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    //@ts-expect-error MakerDMS has incorrect types.
    new MakerDMG({
      overwrite: true,
      icon: './icons/icon.icns',
    }),
  ],
  publishers: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new PublisherGithub({
      repository: { owner: 'toolbase-ai', name: 'toolbase' },
      prerelease: false,
      draft: true,
      generateReleaseNotes: true,
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
