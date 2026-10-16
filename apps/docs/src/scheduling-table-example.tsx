import { TableCellText } from '../../../packages/ui/src/index';
export function SchedulingTableExample() {
  return <section className="radius-foundations" aria-labelledby="scheduling-table-heading"><h4 id="scheduling-table-heading">运营排程 · 长标题表格</h4><p className="cs-help">依据用户提供的瓶颈表格截图建立排版建议；在线站点需要飞书登录，未核对其内部源码。标题不重复卡号，常规字重展示完整任务，补充信息放次级行。</p>
    <div className="cs-table-scroll"><table className="cs-table scheduling-reference-table"><caption className="cs-sr-only">运营排程长标题排版示例，非实时数据</caption><thead><tr><th scope="col">卡号</th><th scope="col">任务</th><th scope="col">阶段</th><th scope="col">依赖</th><th scope="col">停留</th><th scope="col">负责人</th></tr></thead><tbody>
      <tr><td>CRY-1055</td><td><TableCellText description="首页展示分类 · 12 项">产品分类六种语言版本：旧站译名与 slug 写入 Payload，分类网址映射到统一分类</TableCellText></td><td>在写</td><td>12 项</td><td>1.7 小时</td><td>工程主管</td></tr>
      <tr><td>CRY-1056</td><td><TableCellText description="英文旧站路由需要复核">首页方案分类：导入六种语言分类与成功方案，保留路由映射</TableCellText></td><td>待就绪</td><td>11 项</td><td><span className="scheduling-reference-warning">2.3 小时</span></td><td>工程主管</td></tr>
      <tr><td>CRY-720</td><td><TableCellText>解决方案列表与详情接入真实网址，读取 Payload 方案</TableCellText></td><td>在写</td><td>11 项</td><td><span className="scheduling-reference-warning">3.1 小时</span></td><td>Codex</td></tr>
    </tbody></table></div><p className="cs-help">停留时长仅演示排版，不在组件内推断风险阈值。实际风险需消费项目提供明确语义；普通时长不使用品牌色底块。</p>
  </section>;
}
