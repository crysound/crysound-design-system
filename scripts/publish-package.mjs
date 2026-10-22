import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const workspace = process.argv[2];
const distTag = process.argv[3];
if (!workspace || !["next", "latest"].includes(distTag)) {
  throw new Error("Usage: node scripts/publish-package.mjs <workspace> <next|latest>");
}
const manifest = JSON.parse(readFileSync(new URL(`../${workspace}/package.json`, import.meta.url), "utf8"));
const specifier = `${manifest.name}@${manifest.version}`;
const registry = "https://npm.pkg.github.com";
const exists = spawnSync("npm", ["view", specifier, "version", "--registry", registry], { stdio: "ignore" }).status === 0;
if (exists) {
  console.log(`${specifier} already exists; skipping.`);
  process.exit(0);
}
const result = spawnSync("npm", ["publish", "--workspace", manifest.name, "--tag", distTag, "--registry", registry], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
