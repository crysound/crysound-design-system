"use client";
export interface ProgressStep { id: string; title: string; description?: string; disabled?: boolean }
export interface ProgressStepsProps {
  steps: ProgressStep[]; currentStep: string; orientation?: 'horizontal'|'vertical';
  errorStep?: string; onStepChange?: (id: string)=>void; label?: string;
}
export function ProgressSteps({steps,currentStep,orientation='horizontal',errorStep,onStepChange,label='任务步骤'}:ProgressStepsProps) {
  const current=steps.findIndex(step=>step.id===currentStep);
  if(!steps.length)return null;
  return <nav className={`cs-progress-steps cs-progress-steps--${orientation}`} aria-label={label}><ol>{steps.map((step,index)=>{
    const state=step.id===errorStep?'error':index<current?'complete':index===current?'current':'pending';
    const content=<><span className="cs-step-marker" aria-hidden="true">{state==='complete'?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6"/></svg>:state==='error'?'!':index+1}</span><span className="cs-step-copy"><strong>{step.title}</strong>{step.description&&<small>{step.description}</small>}<span className="cs-sr-only">{state==='complete'?'已完成':state==='current'?'当前步骤':state==='error'?'发生错误':'待进行'}</span></span></>;
    return <li key={step.id} data-state={state} data-disabled={step.disabled||undefined}>{onStepChange?<button type="button" className="cs-step-content" aria-current={step.id===currentStep?'step':undefined} disabled={step.disabled} onClick={()=>onStepChange(step.id)}>{content}</button>:<div className="cs-step-content" aria-current={step.id===currentStep?'step':undefined}>{content}</div>}{index < steps.length-1 && <span className="cs-step-connector" aria-hidden="true"/>}</li>;
  })}</ol></nav>;
}
