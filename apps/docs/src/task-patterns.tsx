import {useState} from 'react';
import {Button,Card,Metric,DataTable,DeviceTable,StatusBadge,EmptyState,Dialog,Input,type Device} from '../../../packages/ui/src/index';
import {MeasurementForm,sampleDevices,deviceColumns} from './explorer';
const devices: Device[] = [
  {
    id: "CS-001",
    name: "声学成像仪 01",
    model: "演示型号 A",
    status: "online",
    location: "实验室 A",
  },
  {
    id: "CS-002",
    name: "产线检测工位",
    model: "演示型号 B",
    status: "running",
    location: "生产线 02",
  },
  {
    id: "CS-003",
    name: "环境监测设备",
    model: "演示型号 C",
    status: "warning",
    location: "测试区域",
  },
];
export function TaskPatterns(){
 const [selected,setSelected]=useState<Device>();
 return (<section className="template-task-patterns" aria-label="任务组合">
              <div className="section-heading">
                <div>
                  
                  <h2>为测量工作流而设计</h2>
                </div>
                <span>演示数据</span>
              </div>
              <Card
                title="测量任务配置"
                description="实际组合表单、选择器、滑块与验证反馈。"
              >
                <div className="example">
                  <MeasurementForm />
                </div>
              </Card>
              <Card
                title="设备数据工作台"
                description="支持搜索、排序、分页和跨页选择，全部使用演示数据。"
              >
                <DataTable
                  caption="演示设备工作台"
                  data={sampleDevices}
                  columns={deviceColumns}
                  getRowId={(row) => row.id}
                  selectable
                  pageSize={4}
                />
              </Card>
              <div className="metrics">
                <Card title="声压级">
                  <Metric
                    label="当前读数"
                    animate
                    value="68.4"
                    unit="dB SPL"
                    note="演示数据 · 非实时采集"
                  />
                </Card>
                <Card title="设备连接">
                  <Metric
                    label="在线设备"
                    animate
                    value="2"
                    unit="/ 3"
                    note="运行中设备计入在线"
                  />
                </Card>
                <Card title="采样设置">
                  <Metric
                    label="采样率"
                    animate
                    value="48"
                    unit="kHz"
                    note="演示配置"
                  />
                </Card>
              </div>
              <Card title="设备管理" description="设备、位置与运行状态">
                <DeviceTable
                  devices={devices}
                  onSelect={setSelected}
                />
              </Card>
              {selected && (
                <Card
                  title={selected.name}
                  description={`${selected.id} · ${selected.location}`}
                  actions={
                    <Button
                      variant="ghost"
                      onClick={() => setSelected(undefined)}
                    >
                      收起
                    </Button>
                  }
                >
                  <div className="example">
                    <StatusBadge status={selected.status} />
                    <p>
                      设备详情示例。业务集成时在此接入连接、校准和测量记录。
                    </p>
                  </div>
                </Card>
              )}
              <Card title="空状态">
                <EmptyState
                  title="尚未创建测量任务"
                  description="连接设备后，创建第一个测量任务。"
                  action={
                    <Dialog
                      trigger={<Button>创建任务示例</Button>}
                      title="创建测量任务"
                      description="此流程展示组件组合方式。"
                    >
                      <Input
                        label="任务名称"
                        placeholder="例如：产线噪声检测"
                      />
                    </Dialog>
                  }
                />
              </Card>
            </section>);
}
