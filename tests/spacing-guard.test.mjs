import {it,expect} from 'vitest';
import {mkdtempSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
function probe(source,extension='css',fix=false){const dir=mkdtempSync(join(tmpdir(),'crysound-spacing-'));const file=join(dir,`fixture.${extension}`);try{writeFileSync(file,source);const result=spawnSync(process.execPath,['scripts/validate-spacing.mjs',`--file=${file}`,...fix?['--fix']:[]],{encoding:'utf8'});return {status:result.status,error:result.stderr,source:readFileSync(file,'utf8')};}finally{rmSync(dir,{recursive:true,force:true});}}
it('allows foundation spacing without mistaking borders or typography for gaps',()=>{expect(probe('.item { gap:2px; padding:12px 24px; border:1px solid; font-size:13px; width:19px; }').status).toBe(0);});
it('rejects odd, fractional and off-scale small spacing in CSS',()=>{const result=probe('.item { gap:3px; padding:18px; margin-top:.5px; }');expect(result.status).toBe(1);expect(result.error).toContain('gap: 3px');expect(result.error).toContain('padding: 18px');expect(result.error).toContain('margin-top: 0.5px');});
it('checks inline React spacing and Radix offsets',()=>{const result=probe('const view=<Popover sideOffset={7}><div style={{gap:3,marginTop:"5px",border:"1px solid",fontSize:13}}/></Popover>;','tsx');expect(result.status).toBe(1);expect(result.error).toContain('sideOffset: 7px');expect(result.error).toContain('gap: 3px');expect(result.error).toContain('margin-top: 5px');expect(result.error).not.toContain('border:');});
it('repairs negative spacing with a valid token expression',()=>{const result=probe('.item { margin-left:-3px; gap:5px; }','css',true);expect(result.status).toBe(0);expect(result.source).toContain('calc(var(--cs-space-1) * -1)');expect(result.source).toContain('var(--cs-space-1-5)');});
