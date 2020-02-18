import * as React from 'react';
import { NavigationContainerProps, NavigationContainerRef } from '@react-navigation/core';
import { Theme } from './types';
/**
 * Container component which holds the navigation state
 * designed for mobile apps.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.theme Theme object for the navigators.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
declare const NavigationContainer: React.ForwardRefExoticComponent<NavigationContainerProps & {
    theme?: Theme | undefined;
} & React.RefAttributes<NavigationContainerRef>>;
export default NavigationContainer;
