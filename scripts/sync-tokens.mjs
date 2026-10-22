import { readFileSync, writeFileSync } from "node:fs";
const css = readFileSync(
  new URL("../packages/tokens/src/tokens.css", import.meta.url),
  "utf8",
);
const modes = {};
const aliases = {};
for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
  const selector = match[1].replace(/\/\*[\s\S]*?\*\//g, "").trim();
  const tokens = {};
  const semanticAliases = {};
  for (const declaration of match[2].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    const [, name, value] = declaration;
    if (name.startsWith("cs-")) tokens[name.slice(3)] = { $value: value.trim() };
    else if (!name.startsWith("cds-")) semanticAliases[name] = { $value: value.trim() };
  }
  modes[selector] = { ...modes[selector], ...tokens };
  if (Object.keys(semanticAliases).length) aliases[selector] = { ...aliases[selector], ...semanticAliases };
}
writeFileSync(
  new URL("../packages/tokens/src/tokens.json", import.meta.url),
  JSON.stringify(
    {
      $description:
        "Brand and surfaces traced to Figma; Slate text and system fonts selected by the user. Dark/customer modes are proposed.",
      modes,
      aliases,
    },
    null,
    2,
  ) + "\n",
);
