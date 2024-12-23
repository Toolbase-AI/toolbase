import { parseArgs } from "@std/cli";

function getRunnerTarget(platform?: string, arch?: string) {
  switch (platform) {
    case "darwin":
    case "mas":
      if (arch === "arm64") {
        return "aarch64-apple-darwin";
      } else if (arch === "x64") {
        return "x86_64-apple-darwin";
      }
      break;
    case "win32":
      if (arch === "x64") {
        return "x86_64-pc-windows-msvc";
      }
      break;
    case "linux":
      if (arch === "arm64") {
        return "aarch64-unknown-linux-gnu";
      } else if (arch === "x64") {
        return "x86_64-unknown-linux-gnu";
      }
      break;
  }

  return undefined;
}

const args = parseArgs(Deno.args, {
  string: ["platform", "arch"],
  alias: {
    platform: ["p"],
    arch: ["a"],
  },
});

const runnerTarget = getRunnerTarget(args.platform, args.arch);
const options = runnerTarget ? [`--target=${runnerTarget}`] : [];

// deno compile -A $OPTIONS -o ./out/toolbase-runner mod.ts
const buildCommand = new Deno.Command(Deno.execPath(), {
  args: ["compile", "-A", ...options, "-o", "./out/toolbase-runner", "mod.ts"],
  stdout: "piped",
  stderr: "piped",
});

const child = await buildCommand.output();

Deno.stdout.writeSync(child.stdout);
Deno.stderr.writeSync(child.stderr);
Deno.exit(child.code);
