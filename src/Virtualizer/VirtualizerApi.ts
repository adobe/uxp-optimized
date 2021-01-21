import { ReactElement, CSSProperties } from 'react';

export type ScrollToOptions = { position?: number, duration?: number }

export type VirtualizerInputHandles = {
    /**
     * Scrolls an item into view.
     * This is animated for manual layouts and instant for flow layouts.
     * @param key the key for the item to scroll into view.
     * @param options.position relative position to show item at: 0 = top of window, 1 = bottom of window.
     * @param options.behavior "smooth" for animated or "auto" for jump. Defaults to "smooth" for manual layout and "auto" for flexible layouts.
     */
    scrollToItem(key: string, options?: ScrollToOptions): void
    /**
     * Scrolls by a relative amount in the x and/or y directions.
     * @param x pixels to scroll in the horizontal direction or 0 | null | undefined to not scroll horizontally.
     * @param y pixels to scroll in the vertical direction or 0 | null | undefined to not scroll vertically.
     */
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
     * @deprecated this is only provided for backwards compatibility. Use a ref and @see scrollToItem instead.
     */
    scrollToItem?: string;
    /**
     * The direction to scroll. Defaults to "vertical".
     */
    direction?: "vertical" | "horizontal";
    /**
     * Cache react elements based on key? Defaults to true.
     */
    cacheElements?: boolean;
    id?: string;
    className?: string;
    style?: CSSProperties;
    ref?: any;
};
