import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const { modes, aliases } = JSON.parse(readFileSync(new URL("../packages/tokens/src/tokens.json", import.meta.url), "utf8"));
const required = `background foreground card card-foreground popover popover-foreground primary primary-foreground secondary secondary-foreground muted muted-foreground accent accent-foreground destructive destructive-foreground border input ring success success-soft warning warning-soft info info-soft destructive-soft chart-1 chart-2 chart-3 chart-4 chart-5 sidebar sidebar-foreground sidebar-primary sidebar-primary-foreground sidebar-accent sidebar-accent-foreground sidebar-border sidebar-ring radius font-sans font-heading font-mono`.split(" ");
const light = aliases[":root,\n[data-theme=\"light\"]"];
const dark = aliases['[data-theme="dark"]'];
assert(light, "light token mode is missing");
assert(dark, "dark token mode is missing");

for (const [modeName, mode] of [["light", light], ["dark", dark]]) {
  const available = Object.fromEntries(Object.values(modes).flatMap((tokens) => Object.keys(tokens).map((name) => [`cs-${name}`, tokens[name]])));
  for (const alias of required) {
    assert(mode[alias], `${modeName} is missing --${alias}`);
    const references = [...mode[alias].$value.matchAll(/var\(--([\w-]+)/g)].map((match) => match[1]);
    assert(references.length > 0, `--${alias} must reference an existing token`);
    for (const reference of references) assert(available[reference], `--${alias} references missing --${reference} in ${modeName}`);
  }
}
console.log(`Validated ${required.length} shadcn aliases in light and dark modes.`);
