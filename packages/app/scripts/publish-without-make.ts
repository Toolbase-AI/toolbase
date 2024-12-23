import { api as forge } from '@electron-forge/core';

await forge.publish({
  makeOptions: {
    skipPackage: true,
  },
});
