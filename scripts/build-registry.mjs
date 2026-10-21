import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(
  readFileSync(resolve(root, "packages/ui/package.json"), "utf8"),
);
const files = readdirSync(resolve(root, "packages/ui/src"))
  .filter((file) => /\.(tsx?|css)$/.test(file))
  .sort()
  .map((file) => ({
    path: `packages/ui/src/${file}`,
    type: "registry:file",
    target: `@components/crysound/ui/${file}`,
    content: readFileSync(resolve(root, "packages/ui/src", file), "utf8"),
  }));
files.push({
  path: "packages/tokens/src/tokens.css",
  type: "registry:file",
  target: "@components/crysound/tokens.css",
  content: readFileSync(
    resolve(root, "packages/tokens/src/tokens.css"),
    "utf8",
  ),
});
const item = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "crysound-ui",
  type: "registry:block",
  title: "CRYSOUND Design System",
  description:
    "CRYSOUND semantic tokens and React components. Import tokens.css and ui/styles.css after installation.",
  dependencies: Object.entries(pkg.dependencies)
    .filter(([name]) => !name.startsWith("@crysound/"))
    .map(([name, version]) => `${name}@${version}`),
  files,
};
const directory = resolve(root, "apps/docs/public/r");
mkdirSync(directory, { recursive: true });
writeFileSync(
  resolve(directory, "crysound-ui.json"),
  JSON.stringify(item, null, 2) + "\n",
);
writeFileSync(
  resolve(root, "registry.json"),
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "crysound",
      homepage: "https://github.com/crysound/crysound-design-system",
      items: [{ ...item, $schema: undefined }],
    },
    null,
    2,
  ) + "\n",
);
console.log(`Built registry: ${files.length} source files`);
