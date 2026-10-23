import type {ReactNode} from 'react';

export interface NavigationMenuLink {
 label:string;href:string;description?:string;image?:string;media?:ReactNode;products?:NavigationMenuLink[];
}
export interface NavigationMenuGroup {title:string;links:NavigationMenuLink[];products?:NavigationMenuLink[];}
export interface NavigationMenuItem {
 id:string;label:string;href?:string;groups?:NavigationMenuGroup[];featured?:ReactNode;
 layout?:'columns'|'catalog'|'cards';links?:NavigationMenuLink[];products?:NavigationMenuLink[];footer?:NavigationMenuLink;
 catalogLabels?:{categories:string;products:string};neutralInitialSelection?:boolean;
}
export interface NavigationMenuProps {
 items:NavigationMenuItem[];label?:string;className?:string;brand?:ReactNode;actions?:ReactNode;onNavigate?:(href:string)=>void;
 /** Capsule primary links are intended for brand websites. */
 shape?:'rounded'|'capsule';
 /** Website mega-menu surfaces, catalog cards, and footer geometry. */
 panelVariant?:'default'|'website';
 /** Pointer hover can preview catalog categories; click and keyboard always work. */
 activateOnHover?:boolean;
 /** A local container at 1200px switches to the accessible disclosure menu. */
 collapsible?:boolean;mobileToggleLabels?:{open:string;close:string};
}
