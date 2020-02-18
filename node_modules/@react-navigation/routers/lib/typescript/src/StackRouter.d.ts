import { NavigationState, Router, DefaultRouterOptions } from './types';
export declare type StackActionType = {
    type: 'REPLACE';
    payload: {
        name: string;
        key?: string | undefined;
        params?: object;
    };
    source?: string;
    target?: string;
} | {
    type: 'PUSH';
    payload: {
        name: string;
        key?: string | undefined;
        params?: object;
    };
    source?: string;
    target?: string;
} | {
    type: 'POP';
    payload: {
        count: number;
    };
    source?: string;
    target?: string;
} | {
    type: 'POP_TO_TOP';
    source?: string;
    target?: string;
};
export declare type StackRouterOptions = DefaultRouterOptions;
export declare type StackNavigationState = NavigationState & {
    /**
     * Type of the router, in this case, it's stack.
     */
    type: 'stack';
};
export declare const StackActions: {
    replace(name: string, params?: object | undefined): StackActionType;
    push(name: string, params?: object | undefined): StackActionType;
    pop(count?: number): StackActionType;
    popToTop(): StackActionType;
};
export default function StackRouter(options: StackRouterOptions): Router<StackNavigationState, {
    type: "GO_BACK";
    source?: string | undefined;
    target?: string | undefined;
} | {
    type: "NAVIGATE";
    payload: {
        key: string;
        name?: undefined;
        params?: object | undefined;
    } | {
        name: string;
        key?: string | undefined;
        params?: object | undefined;
    };
    source?: string | undefined;
    target?: string | undefined;
} | {
    type: "RESET";
    payload: import("./types").PartialState<NavigationState>;
    source?: string | undefined;
    target?: string | undefined;
} | {
    type: "SET_PARAMS";
    payload: {
        params?: object | undefined;
    };
    source?: string | undefined;
    target?: string | undefined;
} | {
    type: "REPLACE";
    payload: {
        name: string;
        key?: string | undefined;
        params?: object | undefined;
    };
    source?: string | undefined;
    target?: string | undefined;
} | {
    type: "PUSH";
    payload: {
        name: string;
        key?: string | undefined;
        params?: object | undefined;
    };
    source?: string | undefined;
    target?: string | undefined;
} | {
    type: "POP";
    payload: {
        count: number;
    };
    source?: string | undefined;
    target?: string | undefined;
} | {
    type: "POP_TO_TOP";
    source?: string | undefined;
    target?: string | undefined;
}>;
