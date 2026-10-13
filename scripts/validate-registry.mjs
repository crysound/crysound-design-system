import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import Ajv from "ajv";
const root = resolve(import.meta.dirname, "..");
const schema = JSON.parse(
  readFileSync(resolve(root, "scripts/schemas/registry-item.json"), "utf8"),
);
const item = JSON.parse(
  readFileSync(resolve(root, "apps/docs/public/r/crysound-ui.json"), "utf8"),
);
const validate = new Ajv({ strict: false, allErrors: true }).compile({
  ...schema,
  $schema: "http://json-schema.org/draft-07/schema#",
});
if (!validate(item)) throw new Error(JSON.stringify(validate.errors, null, 2));
const targets = new Set(item.files.map((file) => file.target));
for (const file of item.files) {
  if (!existsSync(resolve(root, file.path)))
    throw new Error(`Missing source: ${file.path}`);
  if (file.content !== readFileSync(resolve(root, file.path), "utf8"))
    throw new Error(`Stale payload: ${file.path}`);
  if (file.target.includes(".."))
    throw new Error(`Invalid target: ${file.target}`);
  for (const match of file.content.matchAll(
    /(?:from\s+|@import\s+)["'](\.\.?\/[^"']+)["']/g,
  )) {
    const base = resolve("/", dirname(file.target), match[1]).slice(1);
    if (
      ![base, `${base}.ts`, `${base}.tsx`].some((target) => targets.has(target))
    )
      throw new Error(
        `Unresolved registry import: ${file.path} -> ${match[1]}`,
      );
  }
}
console.log(
  `Registry schema, source freshness and ${item.files.length} file targets verified.`,
);
