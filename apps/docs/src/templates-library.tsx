import {Tabs,TabsList,TabsTrigger,TabsContent} from '../../../packages/ui/src/index';
import {SceneStyles} from './scene-styles';
import {TaskPatterns} from './task-patterns';
export function canonicalTemplateRoute(route:string){
 if(route==='patterns')return 'templates';
 if(route==='scene-styles')return 'templates/scenes';
 return route;
}
export function TemplatesLibrary({view='tasks',onViewChange}:{view?:'tasks'|'scenes';onViewChange?:(value:'tasks'|'scenes')=>void}){
 const change=(value:string)=>{const next=value==='scenes'?'scenes':'tasks';if(onViewChange)onViewChange(next);else window.location.hash=next==='scenes'?'templates/scenes':'templates';};
 return <div className="templates-page">
  <header className="scene-gallery-heading"><span className="scene-kicker">TEMPLATES</span><h1>样板库</h1><p>按使用范围选择任务组合或完整场景，复用同一套设计系统组件。</p></header>
  <Tabs value={view} onValueChange={change}>
   <TabsList aria-label="样板类型"><TabsTrigger value="tasks">任务组合</TabsTrigger><TabsTrigger value="scenes">完整场景</TabsTrigger></TabsList>
   <TabsContent value="tasks"><p className="templates-description">测量配置、设备数据工作台等局部组合，可嵌入现有产品页面。</p><TaskPatterns/></TabsContent>
   <TabsContent value="scenes"><p className="templates-description">测量工作台、数据看板与品牌官网，展示完整页面的布局与交互。</p><SceneStyles embedded/></TabsContent>
  </Tabs>
 </div>;
}
