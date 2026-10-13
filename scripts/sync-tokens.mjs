import { readFileSync, writeFileSync } from "node:fs";
const css = readFileSync(
  new URL("../packages/tokens/src/tokens.css", import.meta.url),
  "utf8",
);
const modes = {};
for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
  const selector = match[1].replace(/\/\*[\s\S]*?\*\//g, "").trim();
  const tokens = {};
  for (const declaration of match[2].matchAll(/--cs-([\w-]+)\s*:\s*([^;]+);/g))
    tokens[declaration[1]] = { $value: declaration[2].trim() };
  modes[selector] = { ...modes[selector], ...tokens };
}
writeFileSync(
  new URL("../packages/tokens/src/tokens.json", import.meta.url),
  JSON.stringify(
    {
      $description:
        "Brand and light neutrals traced to Figma. Dark/customer modes are proposed.",
      modes,
    },
    null,
    2,
  ) + "\n",
);
