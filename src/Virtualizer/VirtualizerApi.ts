import { ReactElement, CSSProperties } from 'react';

export type VirtualizerInputHandles = {
    /**
     * Scrolls an item into view.
     * This is animated for manual layouts and instant for flow layouts.
     * @param key the key for the item to scroll into view.
     * @param options.position relative position to show item at: 0 = top of window, 1 = bottom of window.
     */
    scrollToItem(key: string, options?: { position?: number }): void
    scrollBy(x: number, y: number): void
}

export type VirtualizerProperties<T = any> = {
    /**
     * Each item represents a potentially visible child element.
     */
    items: T[];
    /**
     * A function which converts an item into a react element.
     * @param item
     */
    children(item: T): ReactElement;
    /**
     * Optional property or function that returns a unique key for each item.
     */
    itemKey?: keyof T | ((item: T) => string);
    /**
     * Optional property or function that returns a type for each item.
     * Rendered elements will only be recycled according to their type.
     * For best performance all elements with the same type should share the same element nesting structure.
     * This ensures minimal element creation at scroll time.
     */
    itemType?: keyof T | ((item: T) => string);
    /**
     * Optional property or function that returns the bounds for each item.
     * This allows the user to specify custom layout.
     * If present then ALL items must have their position specified this way.
     */
    itemRect?: keyof T | ((item: T) => {
        x: number;
        y: number;
        width: number;
        height: number;
    });
    /**
     * The key of an item that should be scrolled into view.
     * Alternatively you can use a 'ref' and call 'scrollToItem(key: string)'.
     */
    scrollToItem?: string;
    /**
     * Number between 0 and 1 where 0 means top of the visible window and 1 means the bottom.
     */
    scrollToPosition?: number;
    id?: string;
    className?: string;
    style?: CSSProperties;
    ref?: any;
};
