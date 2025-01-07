import { parseArgs } from "@std/cli";
import { bundle } from "@deno/emit";
import { createCache } from "@deno/cache-dir";
import process from "node:process";

const args = parseArgs(Deno.args, {
  string: ["module", "cacheRoot"],
  alias: {
    module: ["m"],
    cacheRoot: ["c"],
  },
  "--": true,
});

const moduleName = args.module;

if (!moduleName) {
  console.error(
    "No module provided, please provide a module with '--module==<module>' or '-m=<module>'"
  );
  Deno.exit(1);
}

// Patch process.argv so runner has all options removed before '--' to ignore all args thats specifically for this library.
// @fixme Will most likely not work for Deno MCP servers / modules that utilize Deno.args.
process.argv = ["", "", ...args["--"]];

// Load and bundle up the module.
const loadCache = createCache({ root: args.cacheRoot, readOnly: Deno.build.os === "windows" });
const result = await bundle(moduleName, {
  load(specifier, _isDynamic, cacheSetting, checksum) {
    // If the specifier is a node module, just return it as external.
    // Otherwise, load the module with the cache.
    // https://github.com/denoland/deno_emit/issues/135#issuecomment-1718888327
    if (specifier.startsWith("node:")) {
      return Promise.resolve({ kind: "external", specifier });
    }
    return loadCache.load(specifier, _isDynamic, cacheSetting, checksum);
  },
});

// Execute the bundled module.
// Could write to file too https://github.com/denoland/deno/issues/8256#issuecomment-752018874
await import("data:application/javascript," + encodeURIComponent(result.code));
