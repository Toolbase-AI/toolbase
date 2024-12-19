import type { ConfigEnv, PluginOption, UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vite';
import {
  external,
  getBuildConfig,
  getBuildDefine,
  pluginHotRestart,
} from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'build'>;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);
  const plugins: PluginOption[] = [];
  if (process.env.NODE_ENV !== 'test') {
    plugins.push(pluginHotRestart('restart'));
  }
  const config: UserConfig = {
    build: {
      lib: {
        entry: forgeConfigSelf.entry,
        fileName: () => '[name].js',
        formats: ['es'],
      },
      rollupOptions: {
        external,
      },
    },
    // main process static assets
    //  ./assets dir is copied to .vite/build dir
    publicDir: './assets',
    plugins,
    define,
    resolve: {
      // Load the Node.js entry.
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
