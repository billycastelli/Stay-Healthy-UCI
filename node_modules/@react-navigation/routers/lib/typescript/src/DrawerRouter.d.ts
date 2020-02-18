import { CommonNavigationAction, Router } from './types';
import { TabActionType, TabRouterOptions, TabNavigationState } from './TabRouter';
export declare type DrawerActionType = TabActionType | {
    type: 'OPEN_DRAWER' | 'CLOSE_DRAWER' | 'TOGGLE_DRAWER';
    source?: string;
    target?: string;
};
export declare type DrawerRouterOptions = TabRouterOptions;
export declare type DrawerNavigationState = Omit<TabNavigationState, 'type' | 'history'> & {
    /**
     * Type of the router, in this case, it's drawer.
     */
    type: 'drawer';
    /**
     * List of previously visited route keys and drawer open status.
     */
    history: ({
        type: 'route';
        key: string;
    } | {
        type: 'drawer';
    })[];
};
export declare const DrawerActions: {
    openDrawer(): DrawerActionType;
    closeDrawer(): DrawerActionType;
    toggleDrawer(): DrawerActionType;
    jumpTo(name: string, params?: object | undefined): TabActionType;
};
export default function DrawerRouter(options: DrawerRouterOptions): Router<DrawerNavigationState, DrawerActionType | CommonNavigationAction>;
