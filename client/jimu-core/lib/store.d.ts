import type { Store, Unsubscribe } from 'redux';
import type { IMState } from './types/state';
export declare function createAppStore(initState?: any): Store<IMState>;
export declare function getAppStore(): Store<IMState>;
/**
 * Observe store change
 * @param onChange The callback when the store changes
 * @param keys The path of the state to be observed
 * @param triggerOnObserve Whether to trigger the callback when starting observing.
 */
export declare function observeStore<T>(onChange: (preState: T, state: T) => void, keys?: string[], triggerOnObserve?: boolean): Unsubscribe;
