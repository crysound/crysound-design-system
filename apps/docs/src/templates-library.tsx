import {SceneStyles} from './scene-styles';
export function canonicalTemplateRoute(route:string){
 if(['patterns','scene-styles','templates/scenes'].includes(route))return 'templates';
 return route;
}
export function TemplatesLibrary(){
 return <div className="templates-page">
  <header className="reference-component-heading"><div className="reference-title-row"><div><h1>样板库</h1></div></div><p>测量工作台、品牌官网、数据看板、OpenTest 客户端与品牌空白页，复用同一套设计系统组件，展示页面布局与交互。</p></header>
  <SceneStyles embedded/>
 </div>;
}
