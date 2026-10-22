import {NavigationMenu} from '../../../packages/ui/src/index';
import {brandNavigationItems} from './brand-navigation-items';

export function NavigationMenuDemo() {
 return <div className="navigation-menu-demo">
  <p className="cs-help">公司官网导航 · 三栏目录与图片入口</p>
  <NavigationMenu label="CRYSOUND 公司官网导航" shape="capsule" panelVariant="website" items={brandNavigationItems} activateOnHover/>
  <p className="cs-help">用于 CRYSOUND 公司官网，目录与图片复用官网样板。点击一级导航展开或收起，悬停二级分类预览产品；支持方向键选择分类，Escape 关闭并返回焦点。</p>
 </div>;
}
