import {useState} from 'react';
import {Button,Switch} from '../../../packages/ui/src/index';
import './brand-blank-page.css';

export function BrandBlankSample({standalone=false}:{standalone?:boolean}){
  const [appearance,setAppearance]=useState<'light'|'dark'>('light');
  const [showTitle,setShowTitle]=useState(true);
  const Heading=standalone?'h1':'h2';
  return <div className="brand-blank-sample">
    <div className="brand-blank-controls">
      <div role="group" aria-label="空白页配色">
        <Button variant={appearance==='light'?'primary':'ghost'} aria-pressed={appearance==='light'} onClick={()=>setAppearance('light')}>浅色</Button>
        <Button variant={appearance==='dark'?'primary':'ghost'} aria-pressed={appearance==='dark'} onClick={()=>setAppearance('dark')}>深色</Button>
      </div>
      <Switch label="显示标题" checked={showTitle} onCheckedChange={setShowTitle}/>
    </div>
    <div className="brand-blank-stage">
      <section className="brand-blank-page" data-appearance={appearance} data-theme="light" data-customer="crysound" aria-label="CRYSOUND 品牌空白页">
        <img className="brand-blank-wave" src={`/brand/blank-wave-${appearance}.png`} alt="" aria-hidden="true" draggable={false}/>
        <div className="brand-blank-content">
          <header><img className="brand-blank-logo" src={`/brand/logo-horizontal-${appearance==='dark'?'white':'purple'}.svg`} alt="CRYSOUND" width="596" height="80"/></header>
          <div className={showTitle?'brand-blank-copy':'cs-sr-only'}>
            <Heading>{showTitle?'让声音被看见':'品牌空白页'}</Heading>
            {showTitle&&<p>声学测量与分析</p>}
          </div>
          <footer className="brand-blank-footer"><span>CRYSOUND</span><span>声学测量与分析</span></footer>
        </div>
      </section>
    </div>
  </div>;
}
