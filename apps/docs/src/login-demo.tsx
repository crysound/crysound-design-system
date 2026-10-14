import { useState } from 'react';
import { LoginPage } from '../../../packages/ui/src/index';
export function LoginDemo(){const [message,setMessage]=useState('');return <div className="login-demo"><LoginPage title="欢迎回来" description="登录 CRYSOUND 仪器工作空间。" onForgotPassword={()=>setMessage('请联系工作空间管理员重置密码（演示）。')} onSubmit={async()=>{await new Promise(resolve=>setTimeout(resolve,700));setMessage('演示提交完成，未创建登录会话。');}}/><p role="status" className="cs-help">{message||'仅 UI 演示；输入内容不发送、不记录、不保存。鉴权和记住登录由消费项目接入。'}</p></div>;}
