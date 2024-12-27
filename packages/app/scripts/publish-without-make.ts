import process from 'node:process';
import { api as forge } from '@electron-forge/core';

const isDryRun =
  process.argv[2] === '--dry-run' || process.argv[3] === '--dry-run';

console.log(isDryRun ? 'Starting a dry run' : 'Publishing from dry run');

await forge.publish({
  dryRun: isDryRun,
  dryRunResume: !isDryRun,
  makeOptions: {
    skipPackage: true,
  },
});
