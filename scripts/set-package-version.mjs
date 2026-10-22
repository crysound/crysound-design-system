import { readFileSync, writeFileSync } from "node:fs";

const tag = process.argv[2];
if (!tag || !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag)) {
  throw new Error("Usage: node scripts/set-package-version.mjs v1.2.3[-prerelease]");
}
const version = tag.slice(1);
for (const relativePath of ["../packages/tokens/package.json", "../packages/ui/package.json"]) {
  const url = new URL(relativePath, import.meta.url);
  const manifest = JSON.parse(readFileSync(url, "utf8"));
  manifest.version = version;
  if (manifest.name === "@crysound/ui") manifest.dependencies["@crysound/tokens"] = `^${version}`;
  writeFileSync(url, `${JSON.stringify(manifest, null, 2)}\n`);
}
console.log(JSON.stringify({ version, distTag: version.includes("-") ? "next" : "latest" }));
