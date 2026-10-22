import {DetailPanel} from '../../../packages/ui/src/index';

export function WebsiteDetailPanelDemo(){
 return <div className="website-detail-panel-demo" lang="en"><DetailPanel variant="website" title="Technical Specifications" fields={[
  {id:'array',label:'Mic Array',value:'64 channels'},
  {id:'spl',label:'SPL',value:'28–132 dB'},
  {id:'distance',label:'Distance',value:'0.3–120 m'},
  {id:'resolution',label:'Resolution',value:'5M pixels'},
  {id:'screen',label:'Screen',value:'Capacitive touchscreen'},
  {id:'storage',label:'Storage Capacity',value:'32G (internal)'},
  {id:'video',label:'Video Length',value:'Maximum 5 minutes'},
  {id:'size',label:'Size',value:'150 × 83 × 27.5 mm / 5.91 × 3.27 × 1.08 inches'},
 ]}/></div>;
}
