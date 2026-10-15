import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=resolve(import.meta.dirname,'..');
const version=JSON.parse(readFileSync(join(root,'packages/ui/package.json'),'utf8')).version;
const staging=mkdtempSync(join(tmpdir(),'crysound-install-'));
const output=join(root,'apps/docs/public/downloads');
mkdirSync(output,{recursive:true});
try {
  for (const name of ['tokens','ui']) execFileSync('npm',['pack','--pack-destination',staging,'--silent'],{cwd:join(root,'packages',name),stdio:'pipe'});
  copyFileSync(join(root,'apps/docs/public/r/crysound-ui.json'),join(staging,'crysound-ui.json'));
  writeFileSync(join(staging,'README.md'),`# CRYSOUND React UI ${version}\n\nRequires React 19 and React DOM 19. Unzip into your React project and run:\n\n\`\`\`sh\nnpm install ./crysound-tokens-${version}.tgz ./crysound-ui-${version}.tgz\n\`\`\`\n\nImport once in your app entry:\n\n\`\`\`tsx\nimport '@crysound/tokens/tokens.css';\nimport '@crysound/ui/styles.css';\nimport { Button } from '@crysound/ui';\n\`\`\`\n\nThe included crysound-ui.json is the alternative source Registry. Choose either package installation or Registry installation.\n`);
  const archive=join(output,'crysound-install.zip');
  rmSync(archive,{force:true});
  execFileSync('zip',['-q','-r',archive,'.'],{cwd:staging});
  console.log('Built downloadable install bundle.');
} finally {rmSync(staging,{recursive:true,force:true});}
