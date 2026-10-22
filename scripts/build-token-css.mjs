import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const sourceUrl = new URL("../packages/tokens/src/tokens.json", import.meta.url);
const outputDirectory = new URL("../packages/tokens/dist/", import.meta.url);
const { modes, aliases } = JSON.parse(readFileSync(sourceUrl, "utf8"));

mkdirSync(outputDirectory, { recursive: true });

const selectors = [...new Set([...Object.keys(modes), ...Object.keys(aliases)])];
const theme = selectors
  .map((selector) => {
    const tokens = modes[selector] ?? {};
    const declarations = Object.entries(tokens)
      .map(([name, token]) => `  --cs-${name}: ${token.$value};`)
      .concat(Object.entries(aliases[selector] ?? {}).map(([name, token]) => `  --${name}: ${token.$value};`))
      .join("\n");
    return `${selector} {\n${declarations}\n}`;
  })
  .join("\n\n");

writeFileSync(new URL("theme.css", outputDirectory), `/* Generated from src/tokens.json. */\n${theme}\n`);

const mappings = [
  ["color", ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground", "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground", "destructive", "destructive-foreground", "border", "input", "ring", "success", "success-soft", "warning", "warning-soft", "info", "info-soft", "destructive-soft", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"]],
  ["font", ["font-sans", "font-heading", "font-mono"]],
];
const tailwind = mappings.flatMap(([namespace, names]) =>
  names.map((name) => `  --${namespace}-${name.replace(`${namespace}-`, "")}: var(--${name});`),
).concat([
  "  --radius-sm: var(--cs-radius-sm);",
  "  --radius-md: var(--radius);",
  "  --radius-lg: var(--cs-radius-lg);",
  "  --radius-xl: var(--cs-radius-xl);",
]).join("\n");
writeFileSync(new URL("tailwind.css", outputDirectory), `/* Generated from src/tokens.json for Tailwind CSS v4. */\n@theme inline {\n${tailwind}\n}\n`);
