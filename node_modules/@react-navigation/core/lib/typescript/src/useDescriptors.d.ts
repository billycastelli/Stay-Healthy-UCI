import { NavigationAction, NavigationState, ParamListBase, Router } from '@react-navigation/routers';
import { ChildActionListener, FocusedNavigationListener, NavigatorStateGetter } from './NavigationBuilderContext';
import { NavigationEventEmitter } from './useEventEmitter';
import { Descriptor, NavigationHelpers, RouteConfig, RouteProp } from './types';
declare type Options<State extends NavigationState, ScreenOptions extends object> = {
    state: State;
    screens: Record<string, RouteConfig<ParamListBase, string, ScreenOptions>>;
    navigation: NavigationHelpers<ParamListBase>;
    screenOptions?: ScreenOptions | ((props: {
        route: RouteProp<ParamListBase, string>;
        navigation: any;
    }) => ScreenOptions);
    onAction: (action: NavigationAction, visitedNavigators?: Set<string>) => boolean;
    getState: () => State;
    setState: (state: State) => void;
    addActionListener: (listener: ChildActionListener) => void;
    addFocusedListener: (listener: FocusedNavigationListener) => void;
    addStateGetter: (key: string, getter: NavigatorStateGetter) => void;
    onRouteFocus: (key: string) => void;
    router: Router<State, NavigationAction>;
    emitter: NavigationEventEmitter;
};
/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
export default function useDescriptors<State extends NavigationState, ScreenOptions extends object>({ state, screens, navigation, screenOptions, onAction, getState, setState, addActionListener, addFocusedListener, addStateGetter, onRouteFocus, router, emitter, }: Options<State, ScreenOptions>): {
    [key: string]: Descriptor<Record<string, object | undefined>, string, State, ScreenOptions, {}>;
};
export {};
