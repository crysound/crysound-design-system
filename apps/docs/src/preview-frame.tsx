import {InputCombinationsDemo} from "./input-combinations-demo";
import { type ReactNode, useState } from "react";
import {
  Copy01,
  Check,
  Moon01,
  Sun,
  ArrowLeft,
  ArrowRight,
  Code02,
  LinkExternal01,
} from "@untitledui/icons";
import {
  Button,
  Input,
  NumberInput,
  Rating,
  Combobox,
  Checkbox,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useToast,
} from "../../../packages/ui/src/index";
import { ComponentDemo } from "./explorer";
import type { ComponentDoc } from "./catalog";
import { AvatarStatusDemo, AvatarGroupDemo, AvatarCombinationsDemo, AvatarFallbackDemo } from "./avatar-demo";
import {EmptyStateDemo,EmptyStateSectionDemo,EmptyStateSearchDemo,EmptyStateErrorDemo} from './empty-state-demo';
import {WebsiteDetailPanelDemo} from './detail-panel-demo';
import {RatingSummaryDemo,RatingDistributionRowDemo,RatingScoreDemo,RatingOverviewDemo,RatingReviewCardDemo,RatingReviewsDemo,ratingReviewsExampleCode} from './rating-reviews-demo';
import {NavigationPanelDemo} from './navigation-parts-demo';
export async function copyExample(
  code: string,
  notify: ReturnType<typeof useToast>,
) {
  try {
    await navigator.clipboard.writeText(code);
    notify({ title: "代码已复制" });
  } catch {
    notify({ title: "复制不可用", description: "请在代码页手动选择复制。" });
  }
}
export function PreviewFrame({
  title,
  code,
  children,
  wide = false,
  theme,
  onToggleTheme,
}: {
  title: string;
  code: string;
  children: ReactNode;
  wide?: boolean;
  theme: string;
  onToggleTheme: () => void;
}) {
  const toast = useToast();
  return (
    <section className="reference-example">
      <Tabs defaultValue="preview">
        <div className="reference-example-toolbar">
          <h2>{title}</h2>
          <div className="reference-example-tools">
            <button
              className="docs-icon-button"
              aria-label={`切换${title}的主题`}
              onClick={onToggleTheme}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon01 size={16} />}
            </button>
            <button
              className="docs-icon-button"
              aria-label={`复制${title}代码`}
              onClick={() => copyExample(code, toast)}
            >
              <Copy01 size={16} />
            </button>
            <TabsList variant="pill" aria-label={`${title}展示方式`}>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="preview">
          <div
            className={`reference-preview ${wide ? "reference-preview--wide" : ""}`}
          >
            {children}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <pre className="code-block reference-code">
            <code>{code}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </section>
  );
}
export function LeadExample({ id }: { id: string }) {
  const [value, setValue] = useState("daq");
  const toast = useToast();
  switch (id) {
    case "button":
      return (
        <div className="demo-stack">
          {(['rounded','capsule'] as const).map(shape=><div key={shape}>
            <p className="cs-help">{shape==='rounded'?'系统默认 · 常规圆角':'品牌官网专用 · 99999px'}</p>
            <div className="demo-row" role="group" aria-label={shape==='rounded'?'系统默认按钮':'品牌官网按钮'}>
              <Button shape={shape} variant="danger" onClick={()=>toast({title:"危险操作示例"})}>删除任务</Button>
              <Button shape={shape} variant="secondary" onClick={()=>toast({title:"配置已暂存"})}>暂存配置</Button>
              <Button shape={shape} iconStart={<Check size={18}/>} onClick={()=>toast({title:"已触发采集示例",description:"不会连接真实设备。"})}>开始采集</Button>
            </div>
          </div>)}
        </div>
      );
    case "input":
      return (
        <div className="reference-demo-field">
          <Input
            label="设备名称"
            defaultValue="实验室设备 01"
            hint="用于识别当前设备。"
          />
        </div>
      );
    case "number-input":
      return <div className="reference-demo-field"><NumberInput label="演示阈值 / dB(A)" defaultValue={64} min={30} max={90} step={1} /></div>;
    case "rating-summary": return <RatingSummaryDemo/>;
    case "rating-distribution-row": return <RatingDistributionRowDemo/>;
    case "rating-score": return <RatingScoreDemo/>;
    case "rating-overview": return <RatingOverviewDemo/>;
    case "rating-review-card": return <RatingReviewCardDemo/>;
    case "rating":
      return <Rating label="产品评分" defaultValue={2} hideLabel />;
    case "combobox":
      return (
        <div className="reference-demo-field">
          <Combobox
            label="采集设备"
            value={value}
            onValueChange={setValue}
            options={[
              { value: "daq", label: "SonoDAQ 数据采集" },
              { value: "image", label: "声学成像仪" },
              { value: "noise", label: "环境噪声监测" },
              { value: "offline", label: "离线设备", disabled: true },
            ]}
          />
        </div>
      );
    case "checkbox":
      return (
        <div className="demo-row">
          <Checkbox label="保存原始数据" defaultChecked />
          <Checkbox label="自动生成报告" />
        </div>
      );
    case "switch":
      return (
        <div className="reference-demo-field demo-stack">
          <Switch
            label="自动重连"
            description="设备断开后尝试恢复连接。"
            defaultChecked
          />
          <Switch label="远程访问" />
        </div>
      );
    default:
      return <ComponentDemo id={id} />;
  }
}
export function StateExamples({
  item,
  theme,
  onToggleTheme,
}: {
  item: ComponentDoc;
  theme: string;
  onToggleTheme: () => void;
}) {
  const toast = useToast();
  const frame = (title: string, code: string, children: ReactNode, wide=false) => (
    <PreviewFrame
      key={title}
      title={title}
      code={code}
      theme={theme}
      onToggleTheme={onToggleTheme}
      wide={wide}
    >
      {children}
    </PreviewFrame>
  );
  if(item.id==='detail-panel')
    return frame('官网技术参数', '<DetailPanel\n  variant="website"\n  title="Technical Specifications"\n  fields={[\n    {id:"array", label:"Mic Array", value:"64 channels"},\n    {id:"screen", label:"Screen", value:"Capacitive touchscreen"},\n  ]}\n/>', <WebsiteDetailPanelDemo/>, true);
  if(item.id==='navigation-panel')
    return frame('图片卡片布局', '<NavigationPanel variant="website" item={{id:"resources",label:"Resources",layout:"cards",links:[{label:"Download",href:"/downloads",image:"/downloads.jpg"},{label:"Blogs",href:"/blogs",image:"/blogs.jpg"}]}} />', <NavigationPanelDemo cards/>);
  if(item.id==='empty-state')
    return <>
      {frame('局部内容区', '<EmptyState layout="section" title="暂无附件" description="上传文件后会显示在这里。" graphic="particles" />', <EmptyStateSectionDemo/>)}
      {frame('搜索无结果', '<EmptyState layout="section" title="没有找到匹配记录" description="尝试其他关键词，或清空搜索。" icon={<SearchLg/>} action={<Button onClick={clearSearch}>清空搜索</Button>} />', <EmptyStateSearchDemo/>)}
      {frame('加载失败', '<EmptyState layout="section" title="记录加载失败" description="暂时无法获取测量记录，请重试。" icon={<AlertCircle/>} action={<Button onClick={retry}>重新加载</Button>} />', <EmptyStateErrorDemo/>)}
      {frame('品牌深色背景', '<EmptyState layout="page" tone="brand" title="暂无测量任务" description="创建第一个任务，开始整理测量数据。" icon={null} graphic="particles" action={<Button onClick={createTask}>创建任务</Button>} />', <EmptyStateDemo brand/>, true)}
    </>;
  if (item.id === "avatar")
    return <>
      {frame("Avatar status", '<Avatar name="林晨" initials="L" status="online" />\n<Avatar name="周宁" initials="Z" status="away" />\n<Avatar name="Alex Chen" status="busy" />\n<Avatar name="李娜" initials="L" status="offline" />', <AvatarStatusDemo />)}
      {frame("Avatar groups", '<AvatarGroup label="声学研发团队" size="md" max={3}>\n  <Avatar name="林晨" initials="L" />\n  <Avatar name="Alex Chen" />\n  <Avatar name="周宁" initials="Z" />\n  <Avatar name="李娜" initials="L" />\n  <Avatar name="王明" initials="W" />\n</AvatarGroup>', <AvatarGroupDemo />)}
      {frame("Avatar combinations", '<div>\n  <Avatar name="林晨" initials="L" status="online" />\n  <span>林晨 · 声学工程师</span>\n</div>\n<Avatar name="CRYSOUND" variant="logo" shape="rounded" />', <AvatarCombinationsDemo />)}
      {frame("Avatar fallback and loading", '<Avatar name="林晨" initials="L" loading />\n<Avatar name="陈言" initials="C" src="/user-avatar.png" />\n<Avatar name="Alex Chen" initials="AC" />', <AvatarFallbackDemo />)}
    </>;
  if (item.id === "button")
    return (
      <>
        {(["primary", "secondary", "ghost", "danger"] as const).map(
          (variant, i) =>
            frame(
              [
                "Primary buttons",
                "Secondary buttons",
                "Tertiary buttons",
                "Destructive buttons",
              ][i],
              `<Button variant="${variant}" size="sm">小尺寸</Button>\n<Button variant="${variant}">默认尺寸</Button>\n<Button variant="${variant}" size="lg">大尺寸</Button>`,
              <div className="demo-stack">
                <div className="demo-row">
                  {(["sm", "md", "lg"] as const).map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      操作按钮
                    </Button>
                  ))}
                </div>
                <div className="demo-row">
                  {(["sm", "md", "lg"] as const).map((size) => (
                    <Button key={size} variant={variant} size={size} disabled>
                      不可用
                    </Button>
                  ))}
                </div>
              </div>,
            ),
        )}
        {frame(
          "Loading buttons",
          "<Button loading>正在采集</Button>",
          <div className="demo-row">
            <Button loading>正在采集</Button>
            <Button variant="secondary" loading>
              正在导出
            </Button>
          </div>,
        )}
      </>
    );
  if (item.id === "input")
    return (
      <>
        {frame("Number input horizontal", '<NumberInput label="数量" orientation="horizontal" defaultValue={3} min={0} max={10} />', <div className="reference-demo-field demo-stack number-horizontal-demo"><NumberInput label="数量" orientation="horizontal" defaultValue={3} min={0} max={10}/><NumberInput label="小数步长 / dB" orientation="horizontal" defaultValue={0.5} min={-12} max={12} step={0.1}/><NumberInput label="禁用数量" orientation="horizontal" defaultValue={3} disabled/></div>)}
        {frame("NumberInput", '<NumberInput label="Gain" defaultValue={0.5} step={0.1} />', <ComponentDemo id="number-input" />)}
        {frame("输入框组合", '<Input label="联系电话" leadingSelect={{label:"区号",options:[{value:"+86",label:"+86"},{value:"+1",label:"+1"}]}} />',
          <InputCombinationsDemo/>,
        )}
        {frame(
          "Input with validation",
          '<Input label="连接地址" error="请输入完整的设备地址。" />',
          <div className="reference-demo-field">
            <Input
              label="连接地址"
              defaultValue="192.168."
              error="请输入完整的设备地址。"
            />
          </div>,
        )}
        {frame(
          "Read-only and disabled inputs",
          '<Input label="序列号" readOnly value="CS-2026-001" />',
          <div className="reference-demo-field demo-stack">
            <Input label="只读序列号" value="CS-2026-001" readOnly />
            <Input label="禁用输入" placeholder="请先连接设备" disabled />
          </div>,
        )}
      </>
    );
  if (item.id === "number-input")
    return frame("Number input states", '<NumberInput label="增益 / dB" defaultValue={0.5} min={-12} max={12} step={0.1} />\n<NumberInput label="只读数值" value={1000} readOnly />\n<NumberInput label="禁用数值" defaultValue={4} disabled />', <ComponentDemo id="number-input" />);
  if (item.id === "rating")
    return <>
      {frame('评分摘要 · RatingSummary','<RatingSummary value={4.75} count={4} />',<RatingSummaryDemo/>)}
      {frame('星级分布行 · RatingDistributionRow','<RatingDistributionRow score={5} count={3} total={4} />',<RatingDistributionRowDemo/>)}
      {frame('星级与分数 · RatingScore','<RatingScore value={5} label="产品评分" />',<RatingScoreDemo/>)}
      {frame('评分概览 · RatingOverview','<RatingOverview reviews={reviews} />',<RatingOverviewDemo/>)}
      {frame('评价卡片 · RatingReviewCard','<RatingReviewCard review={review} />',<RatingReviewCardDemo/>,true)}
      {frame('评分概览与用户评价' , ratingReviewsExampleCode, <RatingReviewsDemo/>, true)}
      {frame("Rating states and sizes", '<Rating label="体验评分" value={score} onValueChange={setScore} />\n<Rating label="只读评分" value={4} readOnly />\n<Rating label="禁用评分" defaultValue={2} disabled />', <ComponentDemo id="rating" />)}
    </>;
  if (item.id === "combobox")
    return (
      <>
        {frame(
          "Searchable select",
          '<Combobox label="设备" options={options} />',
          <div className="reference-demo-field">
            <Combobox
              label="设备类型"
              placeholder="搜索并选择设备"
              options={[
                { value: "a", label: "声学成像仪" },
                { value: "b", label: "数据采集终端" },
                { value: "c", label: "环境噪声监测" },
                { value: "d", label: "不可用设备", disabled: true },
              ]}
            />
            <p className="cs-help">
              打开列表后输入关键词，也可使用上下键与 Enter。
            </p>
          </div>,
        )}
        {frame(
          "Disabled select",
          '<Combobox label="设备类型" options={options} disabled />',
          <div className="reference-demo-field">
            <Combobox
              label="设备类型"
              options={[{ value: "a", label: "SonoDAQ 数据采集" }]}
              defaultValue="a"
              disabled
            />
          </div>,
        )}
      </>
    );
  if (item.id === "checkbox")
    return (
      <>
        {frame(
          "Checkbox states",
          '<Checkbox label="部分选中" checked="indeterminate" />',
          <div className="demo-stack">
            <Checkbox label="未选中" />
            <Checkbox label="已选中" defaultChecked />
            <Checkbox label="部分选中" checked="indeterminate" />
            <Checkbox label="禁用已选" checked disabled />
          </div>,
        )}
      </>
    );
  if (item.id === "switch")
    return (
      <>
        {frame(
          "Toggle states",
          '<Switch label="自动重连" defaultChecked />',
          <div className="demo-stack">
            <Switch label="已启用" defaultChecked />
            <Switch label="已关闭" />
            <Switch label="禁用设置" defaultChecked disabled />
          </div>,
        )}
      </>
    );
  return null;
}
export const idsWithStateExamples = new Set([
  "navigation-panel",
  "detail-panel",
  "empty-state",
  "avatar",
  "button",
  "input",
  "number-input",
  "rating",
  "combobox",
  "checkbox",
  "switch",
]);
