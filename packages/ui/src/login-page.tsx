"use client";
import { useId, useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { Button } from './index';
function useLoopingPlaceholder(text: string) {
  const [placeholder, setPlaceholder] = useState(text);
  const [stopped, setStopped] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (stopped || media?.matches) { setPlaceholder(text); return; }
    const characters = Array.from(text);
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    let index = 0;
    const tick = () => {
      if (cancelled) return;
      setPlaceholder(characters.slice(0, index).join(''));
      if (index === characters.length) { index = 0; timer = setTimeout(tick, 1800); }
      else { index += 1; timer = setTimeout(tick, 120); }
    };
    timer = setTimeout(tick, 1800);
    const reduce = () => {
      if (media?.matches) { cancelled = true; clearTimeout(timer); setPlaceholder(text); }
    };
    media?.addEventListener('change', reduce);
    return () => { cancelled = true; clearTimeout(timer); media?.removeEventListener('change', reduce); };
  }, [text, stopped]);
  return { placeholder, stop: () => { setStopped(true); setPlaceholder(text); } };
}
export interface LoginCredentials { account: string; password: string; remember: boolean }
export interface LoginPageProps {
  logo?: ReactNode; title?: string; description?: string;
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>;
  onForgotPassword?: () => void; disabled?: boolean;
}
export function LoginPage({logo,title='登录工作空间',description='使用您的账号访问设备、测量任务和报告。',onSubmit,onForgotPassword,disabled=false}:LoginPageProps) {
  const accountHint = useLoopingPlaceholder('输入工作账号');
  const passwordHint = useLoopingPlaceholder('输入密码');
  const id=useId();const [show,setShow]=useState(false);const [pending,setPending]=useState(false);const [error,setError]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>) {event.preventDefault();if(pending||disabled)return;const form=event.currentTarget;const data=new FormData(form);setError('');setPending(true);try{await onSubmit({account:String(data.get('account')??'').trim(),password:String(data.get('password')??''),remember:data.get('remember')==='on'});}catch(err){setError(err instanceof Error?err.message:'登录失败，请稍后重试。');}finally{setPending(false);}}
  return <section className="cs-login-page" aria-labelledby={`${id}-title`}>
    <div className="cs-login-card">{logo&&<div className="cs-login-logo">{logo}</div>}<h2 id={`${id}-title`}>{title}</h2><p className="cs-login-description">{description}</p>
    <form onSubmit={submit} className="cs-login-form" aria-busy={pending}>
      <div className="cs-field"><label htmlFor={`${id}-account`}>账号</label><input className="cs-input" id={`${id}-account`} name="account" autoComplete="username" required placeholder={accountHint.placeholder} onFocus={accountHint.stop} onChange={accountHint.stop} disabled={pending||disabled} /></div>
      <div className="cs-field"><label htmlFor={`${id}-password`}>密码</label><div className="cs-login-password"><input className="cs-input" id={`${id}-password`} name="password" type={show?'text':'password'} autoComplete="current-password" required placeholder={passwordHint.placeholder} onFocus={passwordHint.stop} onChange={passwordHint.stop} disabled={pending||disabled}/><button type="button" aria-label={show?'隐藏密码':'显示密码'} aria-pressed={show} disabled={pending||disabled} onClick={()=>setShow(!show)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{show&&<path d="m3 3 18 18"/>}</svg></button></div></div>
      <div className="cs-login-options"><label><input type="checkbox" name="remember" disabled={pending||disabled}/>记住登录</label>{onForgotPassword&&<button type="button" disabled={pending||disabled} onClick={onForgotPassword}>忘记密码？</button>}</div>
      {error&&<p className="cs-login-error" role="alert">{error}</p>}
      <Button type="submit" loading={pending} disabled={disabled}>{pending?'正在登录…':'登录'}</Button>
    </form></div>
  </section>;
}
