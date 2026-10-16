import { readFile } from 'node:fs/promises';
// Public component defaults must consume complete roles, independent of docs CSS.
const expected = new Map([
  ['.cs-label', 'label'], ['.cs-field label', 'label'], ['.cs-help', 'caption'], ['.cs-error', 'caption'],
  ['.cs-table', 'body'], ['.cs-table small', 'caption'], ['.cs-tabs-trigger', 'control'],
  ['.cs-accordion-trigger', 'label'], ['.cs-accordion-content > div', 'body'],
  ['.cs-dialog h2:not(.cs-heading)', 'section'], ['.cs-sheet h2:not(.cs-heading)', 'section'],
  ['.cs-alert-content > div', 'body'], ['.cs-login-card h2', 'page'],
  ['.cs-section-header-description', 'body'], ['.cs-inline-cta-content > div', 'body'],
]);
const found = new Set();
const failures = [];
for (const file of ['styles.css', 'extended.css']) {
  const css = (await readFile(`packages/ui/src/${file}`, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, selector, declarations] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const role = expected.get(selector.trim());
    if (!role) continue;
    found.add(selector.trim());
    for (const [property, token] of [['font-size', 'size'], ['line-height', 'leading']]) {
      const expression = new RegExp(`${property}\\s*:\\s*var\\(--cs-type-${role}-${token}\\)`);
      if (!expression.test(declarations)) failures.push(`${file}: ${selector.trim()} must use ${role} ${property}`);
    }
  }
}
for (const selector of expected.keys()) if (!found.has(selector)) failures.push(`Missing typography contract: ${selector}`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Shared typography roles verified independently of documentation styles.');
