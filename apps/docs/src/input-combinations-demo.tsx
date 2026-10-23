import {SearchLg,Lock01} from "@untitledui/icons";
import {Input,useToast} from "../../../packages/ui/src/index";
export function InputCombinationsDemo(){
 const toast=useToast();
 return <div className="input-combinations-demo">
            <Input label="搜索设备" type="search" placeholder="输入名称" clearable iconStart={<SearchLg />} />
            <Input label="联系电话" required helpTooltip="选择区号后输入联系电话。" hint="用于联系设备负责人。" type="tel" placeholder="138 0000 0000" leadingSelect={{label:"区号",options:[{value:"+86",label:"+86"},{value:"+1",label:"+1"}]}} />
            <Input label="金额" required helpTooltip="选择金额对应的币种。" hint="输入金额并选择币种。" inputMode="decimal" placeholder="0.00" prefix="¥" trailingSelect={{label:"币种",options:[{value:"CNY",label:"CNY"},{value:"USD",label:"USD"}]}} />
            <Input label="网站地址" required prefix="https://" prefixDivider helpTooltip="只需输入域名，无需重复输入协议。" hint="输入完整的网站域名。" placeholder="example.com" />
            <Input label="测量时长" suffix="秒" placeholder="60" inputMode="numeric" />
            <Input label="密码" required iconStart={<Lock01 />} type="password" passwordToggle defaultValue="demo-password" autoComplete="new-password" />
            <Input label="设备地址" defaultValue="192.168.1.100" trailingAction={{label:"检查",onClick:()=>toast({title:"地址格式示例"})}} />
            <Input label="小号输入框" controlSize="sm" placeholder="32px（默认密度）" />
            <Input label="大号输入框" controlSize="lg" placeholder="48px（默认密度）" />
          </div>;
}
