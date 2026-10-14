"use client";
import { TextReveal, revealText } from "./text-reveal";
import { useId, useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { Button } from './index';
function useLoopingPlaceholder(text: string, startDelay = 0) {
  const [cycle, setCycle] = useState(0);
  const [stopped, setStopped] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (stopped || media?.matches) return;
    const timer = setInterval(() => setCycle(value => value + 1), 4000);
    const reduce = () => { if (media?.matches) { clearInterval(timer); setStopped(true); } };
    media?.addEventListener('change', reduce);
    return () => { clearInterval(timer); media?.removeEventListener('change', reduce); };
  }, [stopped]);
  return {
    hint: !stopped && <span key={cycle} className="cs-login-hint" aria-hidden="true">{Array.from(text).map((character, index) => <span key={index} style={{ animationDelay: `${startDelay + index * 90}ms` }}>{character}</span>)}</span>,
    stop: () => setStopped(true),
  };
}
export interface LoginCredentials { account: string; password: string; remember: boolean }
export interface LoginPageProps {
  logo?: ReactNode; title?: string; description?: string;
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>;
  onForgotPassword?: () => void; disabled?: boolean;
}
export function LoginPage({logo,title='登录工作空间',description='使用您的账号访问设备、测量任务和报告。',onSubmit,onForgotPassword,disabled=false}:LoginPageProps) {
  const accountHint = useLoopingPlaceholder('输入工作账号');
  const passwordHint = useLoopingPlaceholder('输入密码', 630);
  const id=useId();const [show,setShow]=useState(false);const [pending,setPending]=useState(false);const [error,setError]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>) {event.preventDefault();if(pending||disabled)return;const form=event.currentTarget;const data=new FormData(form);setError('');setPending(true);try{await onSubmit({account:String(data.get('account')??'').trim(),password:String(data.get('password')??''),remember:data.get('remember')==='on'});}catch(err){setError(err instanceof Error?err.message:'登录失败，请稍后重试。');}finally{setPending(false);}}
  return <section className="cs-login-page" aria-labelledby={`${id}-title`}>
    <div className="cs-login-card">{logo&&<div className="cs-login-logo">{logo}</div>}<h2 id={`${id}-title`}><TextReveal text={title}/></h2><p className="cs-login-description"><TextReveal text={description}/></p>
    <form onSubmit={submit} className="cs-login-form" aria-busy={pending}>
      <div className="cs-field"><label htmlFor={`${id}-account`}>账号</label><div className="cs-login-input"><input className="cs-input" id={`${id}-account`} name="account" autoComplete="username" required placeholder="输入工作账号" onFocus={accountHint.stop} onChange={accountHint.stop} disabled={pending||disabled} />{accountHint.hint}</div></div>
      <div className="cs-field"><label htmlFor={`${id}-password`}>密码</label><div className="cs-login-password cs-login-input"><input className="cs-input" id={`${id}-password`} name="password" type={show?'text':'password'} autoComplete="current-password" required placeholder="输入密码" onFocus={passwordHint.stop} onChange={passwordHint.stop} disabled={pending||disabled}/>{passwordHint.hint}<button type="button" aria-label={show?'隐藏密码':'显示密码'} aria-pressed={show} disabled={pending||disabled} onClick={()=>setShow(!show)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{show&&<path d="m3 3 18 18"/>}</svg></button></div></div>
      <div className="cs-login-options"><label><input type="checkbox" name="remember" disabled={pending||disabled}/>记住登录</label>{onForgotPassword&&<button type="button" disabled={pending||disabled} onClick={onForgotPassword}>忘记密码？</button>}</div>
      {error&&<p className="cs-login-error" role="alert">{error}</p>}
      <Button type="submit" loading={pending} disabled={disabled}>{pending?'正在登录…':'登录'}</Button>
    </form></div>
  </section>;
}
