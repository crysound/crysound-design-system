import {SceneStyles} from './scene-styles';
export function canonicalTemplateRoute(route:string){
 if(['patterns','scene-styles','templates/scenes'].includes(route))return 'templates';
 return route;
}
export function TemplatesLibrary(){
 return <div className="templates-page">
  <header className="scene-gallery-heading"><span className="scene-kicker">TEMPLATES</span><h1>样板库</h1><p>测量工作台、品牌官网与数据看板，复用同一套设计系统组件，展示完整页面的布局与交互。</p></header>
  <SceneStyles embedded/>
 </div>;
}
