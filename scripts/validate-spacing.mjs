import {readFile,writeFile,readdir} from 'node:fs/promises';
import ts from 'typescript';
const fix=process.argv.includes('--fix');
const tokenCss=await readFile('packages/tokens/src/tokens.css','utf8');
const scale=new Map([...tokenCss.matchAll(/--(cs-space-[\w-]+):\s*(\d+)px/g)].map(([,name,n])=>[Number(n),name]));
const values=[...scale.keys()].sort((a,b)=>a-b);
const spacing=/^(?:(?:scroll-)?(?:margin|padding)(?:-.+)?|(?:row-|column-)?gap|inset(?:-.+)?|top|right|bottom|left|outline-offset|text-underline-offset|border-spacing)$/;
const flow=/^(?:(?:scroll-)?(?:margin|padding)(?:-.+)?|(?:row-|column-)?gap|border-spacing)$/;
const invalid=(prop,n)=>!Number.isInteger(n)||Math.abs(n)%2===1||(flow.test(prop)&&Math.abs(n)<=96&&!scale.has(Math.abs(n)));
const nearest=n=>{const sign=n<0?-1:1;const v=Math.abs(n);if(v>256)return sign*(Math.round(v/2)*2);return sign*values.reduce((a,b)=>Math.abs(b-v)<=Math.abs(a-v)?b:a);};
const cssName=s=>s.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
let changes=0;const failures=[];
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(`${dir}/${e.name}`):[`${dir}/${e.name}`]))).flat();}
const inputs=process.argv.filter(arg=>arg.startsWith('--file=')).map(arg=>arg.slice(7));
for(const file of inputs.length?inputs:[...await files('packages/ui/src'),...await files('apps/docs/src')]){
 let source=await readFile(file,'utf8');const edits=[];
 const patch=(start,end,value,prop,n)=>{const next=nearest(n);failures.push(`${file}: ${prop}: ${n}px -> ${next}px`);if(fix){edits.push({start,end,value:value(next)});changes++;}};
 if(file.endsWith('.css')){
  // Strip comments without changing offsets; parse declaration boundaries, not border/shadow/font values.
  const clean=source.replace(/\/\*[\s\S]*?\*\//g,m=>m.replace(/[^\n]/g,' '));
  const decl=/(?:^|[;{}])\s*([\w-]+)\s*:\s*([^;{}]+)/g;
  for(const m of clean.matchAll(decl)){const prop=m[1];if(!spacing.test(prop))continue;const offset=m.index+m[0].length-m[2].length;
   for(const v of m[2].matchAll(/(?<![\w.])(-?(?:\d+(?:\.\d+)?|\.\d+))px\b/g)){const n=Number(v[1]);if(!invalid(prop,n))continue;patch(offset+v.index,offset+v.index+v[0].length,next=>{const token=scale.get(Math.abs(next));return next===0?'0':token?(next<0?`calc(var(--${token}) * -1)`:`var(--${token})`):`${next}px`;},prop,n);}
  }
 }else if(/\.tsx?$/.test(file)){
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const visit=node=>{
   if(ts.isJsxAttribute(node)&&node.initializer&&ts.isJsxExpression(node.initializer)){
    const expression=node.initializer.expression;
    if(node.name.getText(ast)==='style'&&expression&&ts.isObjectLiteralExpression(expression))for(const p of expression.properties){if(!ts.isPropertyAssignment(p))continue;const prop=cssName(p.name.getText(ast).replace(/['"]/g,''));if(!spacing.test(prop))continue;const v=p.initializer;let num;if(ts.isNumericLiteral(v))num=Number(v.text);else if(ts.isPrefixUnaryExpression(v)&&v.operator===ts.SyntaxKind.MinusToken&&ts.isNumericLiteral(v.operand))num=-Number(v.operand.text);
     if(num!==undefined&&invalid(prop,num))patch(v.getStart(ast),v.end,n=>String(n),prop,num);
     if(ts.isStringLiteral(v))for(const m of v.text.matchAll(/(-?(?:\d+(?:\.\d+)?|\.\d+))px\b/g)){const n=Number(m[1]);if(invalid(prop,n))patch(v.getStart(ast)+1+m.index,v.getStart(ast)+1+m.index+m[0].length,n=>`${n}px`,prop,n);}
    }
    if(['sideOffset','alignOffset','collisionPadding'].includes(node.name.getText(ast))&&expression&&ts.isNumericLiteral(expression)){const n=Number(expression.text);if(invalid('gap',n))patch(expression.getStart(ast),expression.end,n=>String(n),node.name.getText(ast),n);}
   }ts.forEachChild(node,visit);
  };visit(ast);
 }
 if(fix&&edits.length){for(const e of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,e.start)+e.value+source.slice(e.end);await writeFile(file,source);}
}
if(fix)console.log(`Aligned ${changes} spacing values to the foundation scale.`);
else if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('Spacing follows the foundation scale; no odd or fractional pixel spacing. Borders, typography, shadows and geometry dimensions are separate contracts.');
