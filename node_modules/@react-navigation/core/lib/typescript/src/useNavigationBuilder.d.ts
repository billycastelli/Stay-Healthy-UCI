import { DefaultRouterOptions, NavigationState, RouterFactory, PartialState, NavigationAction } from '@react-navigation/routers';
import { DefaultNavigatorOptions, PrivateValueStore } from './types';
/**
 * Hook for building navigators.
 *
 * @param createRouter Factory method which returns router object.
 * @param options Options object containing `children` and additional options for the router.
 * @returns An object containing `state`, `navigation`, `descriptors` objects.
 */
export default function useNavigationBuilder<State extends NavigationState, RouterOptions extends DefaultRouterOptions, ScreenOptions extends object, EventMap extends Record<string, any>>(createRouter: RouterFactory<State, any, RouterOptions>, options: DefaultNavigatorOptions<ScreenOptions> & RouterOptions): {
    state: State;
    navigation: {
        dispatch(action: NavigationAction | ((state: NavigationState) => NavigationAction)): void;
        navigate<RouteName extends string>(...args: [RouteName] | [RouteName, object | undefined]): void;
        navigate<RouteName_1 extends string>(route: {
            key: string;
            params?: object | undefined;
        } | {
            name: RouteName_1;
            key?: string | undefined;
            params: object | undefined;
        }): void;
        replace<RouteName_2 extends string>(args_0: RouteName_2, args_1: object | undefined): void;
        reset(state: NavigationState | PartialState<NavigationState>): void;
        goBack(): void;
        isFocused(): boolean;
        canGoBack(): boolean;
    } & PrivateValueStore<Record<string, object | undefined>, string, {}> & import("./types").EventEmitter<EventMap> & {
        setParams<RouteName_3 extends string>(params: object | undefined): void;
    } & {
        dispatch(action: NavigationAction | ((state: any) => NavigationAction)): void;
        navigate<RouteName_4 extends string>(...args: [RouteName_4] | [RouteName_4, object | undefined]): void;
        navigate<RouteName_5 extends string>(route: {
            key: string;
            params?: object | undefined;
        } | {
            name: RouteName_5;
            key?: string | undefined;
            params: object | undefined;
        }): void;
        replace<RouteName_6 extends string>(args_0: RouteName_6, args_1: object | undefined): void;
        reset(state: any): void;
        goBack(): void;
        isFocused(): boolean;
        canGoBack(): boolean;
    } & {
        setParams(params: object | undefined): void;
        setOptions(options: Partial<any>): void;
        dangerouslyGetParent<T = import("./types").NavigationProp<Record<string, object | undefined>, string, NavigationState, {}, {}> | undefined>(): T;
        dangerouslyGetState(): any;
    } & import("./types").EventConsumer<any> & PrivateValueStore<Record<string, object | undefined>, string, any>;
    descriptors: {
        [key: string]: import("./types").Descriptor<Record<string, object | undefined>, string, State, ScreenOptions, {}>;
    };
};
