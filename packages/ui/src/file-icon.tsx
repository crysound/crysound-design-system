"use client";
import type { SVGProps } from "react";
export const fileIconTypes = ['audio','code','document','empty','folder','image','img','spreadsheets','video','video-01','video-02','aep','ai','avi','css','csv','dmg','doc','docx','eps','exe','fig','gif','html','indd','java','jpeg','jpg','js','json','mkv','mp3','mp4','mpeg','pdf','pdf-simple','png','ppt','pptx','psd','rar','rss','sql','svg','tiff','txt','wav','webp','xls','xlsx','xml','zip'] as const;
export type FileIconType = typeof fileIconTypes[number];
export type FileIconVariant = 'default' | 'gray' | 'solid';
const groups: [string[], string][] = [
  [['pdf','pdf-simple'], '#dc2626'],
  [['doc','docx','document','txt'], '#2563eb'],
  [['csv','xls','xlsx','spreadsheets'], '#16a34a'],
  [['ppt','pptx','ai','eps','rss'], '#ea580c'],
  [['audio','mp3','wav','video','video-01','video-02','avi','mkv','mp4','mpeg','aep'], '#9333ea'],
  [['image','img','png','jpg','jpeg','gif','svg','webp','tiff','psd','fig','indd'], '#db2777'],
];
export function FileIcon({ type = 'document', variant = 'default', size = 40, ...props }: Omit<SVGProps<SVGSVGElement>, 'type'> & { type?: FileIconType; variant?: FileIconVariant; size?: number }) {
  const color = variant === 'gray' ? '#64748b' : groups.find(([types])=>types.includes(type))?.[1] ?? '#475569';
  const solid = variant === 'solid';
  const label = ['audio','code','document','empty','folder','image','img','spreadsheets','video','video-01','video-02'].includes(type) ? '' : type.replace('-simple','').toUpperCase();
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
    {type === 'folder' ? <path d="M5 14a4 4 0 0 1 4-4h10l5 5h15a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z" fill={solid?color:'#f8fafc'} stroke={color} strokeWidth="1.5" /> : <><path d="M13 4h17l10 10v26a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" fill={solid?color:'#fff'} stroke={solid?color:'#cbd5e1'} strokeWidth="1.5" /><path d="M30 4v8a2 2 0 0 0 2 2h8" stroke={solid?'#ffffffaa':'#cbd5e1'} strokeWidth="1.5" /></>}
    {label ? <><rect x="3" y="25" width={label.length>3?38:32} height="15" rx="3" fill={solid?'#fff':color} /><text x={label.length>3?22:19} y="35.7" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill={solid?color:'#fff'}>{label}</text></> : type !== 'empty' && type !== 'folder' ? <g stroke={solid?'#fff':color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{type==='code' ? <path d="m19 24-5 5 5 5m10-10 5 5-5 5m-4-12-3 16" /> : /audio/.test(type) ? <><path d="M22 33V22l9-2v11" /><circle cx="19" cy="34" r="3" /><circle cx="28" cy="32" r="3" /></> : /image|img/.test(type) ? <><rect x="15" y="22" width="19" height="14" rx="2" /><path d="m15 33 6-6 5 5 4-3 4 4" /><circle cx="29" cy="26" r="1" /></> : /video/.test(type) ? <path d="m21 22 11 7-11 7Z" /> : type==='spreadsheets' ? <><rect x="15" y="22" width="19" height="15" rx="1" /><path d="M15 27h19M15 32h19m-13-10v15m7-15v15" /></> : <path d="M16 24h17M16 29h17M16 34h11" />}</g> : null}
  </svg>;
}
