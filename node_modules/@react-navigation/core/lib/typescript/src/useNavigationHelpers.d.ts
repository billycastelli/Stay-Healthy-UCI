import { NavigationAction, NavigationState, Router } from '@react-navigation/routers';
import { NavigationEventEmitter } from './useEventEmitter';
import { NavigationProp, PrivateValueStore } from './types';
declare type Options<State extends NavigationState, Action extends NavigationAction> = {
    onAction: (action: NavigationAction, visitedNavigators?: Set<string>) => boolean;
    getState: () => State;
    emitter: NavigationEventEmitter;
    router: Router<State, Action>;
};
/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
export default function useNavigationHelpers<State extends NavigationState, Action extends NavigationAction, EventMap extends Record<string, any>>({ onAction, getState, emitter, router }: Options<State, Action>): {
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
    reset(state: NavigationState | import("@react-navigation/routers").PartialState<NavigationState>): void;
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
    dangerouslyGetParent<T = NavigationProp<Record<string, object | undefined>, string, NavigationState, {}, {}> | undefined>(): T;
    dangerouslyGetState(): any;
} & import("./types").EventConsumer<any> & PrivateValueStore<Record<string, object | undefined>, string, any>;
export {};
