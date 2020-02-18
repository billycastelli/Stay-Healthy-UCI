import * as React from 'react';
import { NavigationContainerRef, NavigationState } from '@react-navigation/core';
import { LinkingOptions } from './types';
export default function useLinking(ref: React.RefObject<NavigationContainerRef>, { config, getStateFromPath, getPathFromState, }: LinkingOptions): {
    getInitialState: () => Promise<(Partial<Pick<NavigationState, "index" | "history">> & {
        stale?: true | undefined;
        type?: string | undefined;
        routes: (Pick<import("@react-navigation/core").Route<string>, "name" | "params"> & {
            key?: string | undefined;
            state?: import("@react-navigation/core").InitialState | undefined;
        })[];
    } & {
        state?: (Partial<Pick<NavigationState, "index" | "history">> & {
            stale?: true | undefined;
            type?: string | undefined;
            routes: (Pick<import("@react-navigation/core").Route<string>, "name" | "params"> & {
                key?: string | undefined;
                state?: import("@react-navigation/core").InitialState | undefined;
            })[];
        } & any) | undefined;
    }) | undefined>;
};
