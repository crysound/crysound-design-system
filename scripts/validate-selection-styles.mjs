import { readdir, readFile } from 'node:fs/promises';

const directories = ['packages/ui/src', 'apps/docs/src'];
const selectedState = /aria-(?:selected|current|pressed)|data-selected|data-state\s*=\s*["']?(?:active|checked|current)/;
const failures = [];
for (const directory of directories) {
  for (const name of await readdir(directory)) {
    if (!name.endsWith('.css')) continue;
    const path = `${directory}/${name}`;
    const source = (await readFile(path, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (selectedState.test(match[1]) && /\bfont-weight\s*:/.test(match[2])) failures.push(`${path}: ${match[1].trim()}`);
    }
  }
}
if (failures.length) {
  console.error('Selection must retain the base text weight. Move font-weight to the base component rule:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Selection styles preserve base text weight across UI and documentation.');
}
