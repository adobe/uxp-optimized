/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/
import React, { useState, useRef, useMemo, forwardRef, useImperativeHandle, Ref, MutableRefObject, ForwardRefRenderFunction } from 'react';
import VirtualManager, { ItemProperty } from './VirtualManager';
import memoize from '../common/memoize';
import '../common/shims';
import { ScrollToOptions, VirtualizerInputHandles, VirtualizerProperties } from './VirtualizerApi';

function createPropertyGetter<T,V>(property: keyof T | ItemProperty<T,V> | undefined):  ItemProperty<T,V> | undefined
function createPropertyGetter<T,V>(property: keyof T | ItemProperty<T,V> | undefined, defaultValue: () => ItemProperty<T,V>, validator?: (value: V, item: T) => void):  ItemProperty<T,V>
function createPropertyGetter<T,V>(
    property: keyof T | ItemProperty<T,V> | undefined,
    defaultValue?: () => ItemProperty<T,V>,
    validator?: (value: V, item: T) => void
):  ItemProperty<T,V> | undefined {
    if (property == null) {
        return typeof defaultValue === "function"
            ? (defaultValue as any)()
            : undefined;
    }
    if (typeof property === "function") {
        return (item: T) => {
            const result = property(item);
            if (validator) {
                validator(result, item);
            }
            return result;
        }
    }
    if (typeof property === "string" || typeof property === "symbol") {
        return (item: T) => item[property] as any as V;
    }
    throw new Error(`Unsupported property: ${property}`);
}

export default forwardRef(function Virtualizer<T>(properties: VirtualizerProperties<T>, ref: Ref<VirtualizerInputHandles>) {
    let { items, itemKey, itemType, itemRect, scrollToItem, onLayout, cacheElements = true, style, children: factory, columnGap, rowGap, ...otherProps } = properties;
    let horizontal = properties.direction === "horizontal";
    const itemKeyFunction = useMemo(() => memoize(createPropertyGetter(itemKey, () => {
        //  if user provides no key property/function
        //  then we use the item index as key
        const itemToIndex = new Map<T,string>(items.map((item, index) => [item, String(index)]));
        return (item: T) => itemToIndex.get(item)!;
    }, (value, item) => {
        if (typeof value !== 'string' || value.length === 0) {
            throw new Error(`Invalid key, expected a unique string, actual: (${JSON.stringify(value || null)}) for item: ${JSON.stringify(item)}`);
        }
    })), [ itemKey, items ]);
    const itemTypeFunction = useMemo(() => memoize(createPropertyGetter(itemType, () => () => "default")), [ itemType, items ]);
    const itemRectFunction = useMemo(() => createPropertyGetter(itemRect), [ itemRect, items ]);
    let [renderKeys, setRenderKeys] = useState(new Array<string>());
    // we use a ref so we can persist the manager between calls to this component function.
    const cache = useRef<{ container?: HTMLDivElement }>();
    if (cache.current == null) {
        cache.current = { };
    }
    function scrollByFunction(x: number, y: number) {
        const container = cache.current!.container;
        // x is ignored, since we only scroll vertically
        if (container && y) {
            // Would be cleaner to use container.scrollBy, but UXP doesn't support this
            // Instead, we need to compute the scrollTop to set based on the passed in offset
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;
            const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
            const scrollTop = Math.max(0, Math.min(maxScrollTop, container.scrollTop + y));
            container.scrollTo({ top: scrollTop });
        }
    }
    function scrollToItemFunction(key: string, options?: ScrollToOptions) {
        let container = cache.current!.container
        if (container) {
            let manager = VirtualManager.instance(container);
            manager?.scrollToItem(key, options);
        }
    }
    function getManager() {
        let container = cache.current?.container
        return container ? VirtualManager.instance(container) : null;
    }
    function getRenderKeys() {
        return renderKeys;
    }
    function getItemRect(key: string) {
        let manager = getManager();
        if (manager) {
            let rect = manager.getItemRect(null, key)
            if (rect) {
                //  we remove just the properties we want since the manager stores extra information
                //  on the rect structure.
                let { x, y, width, height } = rect;
                return { x, y, width, height };
            }
        }
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    function getVisibleRect() {
        return getManager()?.getVisibleRect() || { x: 0, y: 0, width: 0, height: 0 }
    }
    useImperativeHandle(ref, () => ({
        scrollToItem: scrollToItemFunction,
        scrollBy: scrollByFunction,
        getRenderKeys,
        getItemRect,
        getVisibleRect,
        container: cache.current!.container,
    }), [cache.current.container]);
    function setContainer(container) {
        if (container) {
            cache.current!.container = container;
            //  we also update the renderKeys immediately
            //  this matters for future renders where
            //  we are calling setContainer with the cached container
            //  we want the correct renderKeys BEFORE we hit this functions element declaration.
            renderKeys = VirtualManager.update({
                container,
                horizontal,
                items,
                renderKeys,
                setRenderKeys,
                itemKey: itemKeyFunction,
                itemType: itemTypeFunction,
                itemRect: itemRectFunction,
                columnGap,
                rowGap,
                onLayout,
            });
            //  if we have a scrollToItem then we scroll to it now.
            if (scrollToItem) {
                scrollToItemFunction(scrollToItem);
            }
        }
    }
    //  There is a delay between future renders and calling setContainer.
    //  if we know the Container already, we call setContainer now
    if (cache.current.container) {
        setContainer(cache.current.container);
    }
    style = Object.assign({
        position: "relative",
        overflowX: horizontal ? "scroll" : "hidden",
        overflowY: horizontal ? "hidden" : "scroll",
        flex: "1 1 auto",
        zIndex: 0
    }, style);
    return (
        <div ref={setContainer as any} style={style} {...otherProps}>
            {
                VirtualManager.getReactElements(
                    items,
                    renderKeys,
                    itemKeyFunction,
                    itemTypeFunction,
                    factory,
                    //  if we aren't caching elements then we return a new cache object each time
                    //  which effectively disables caching
                    cacheElements ? cache.current : {}
                )
            }
        </div>
    );
}) as ForwardRefRenderFunction<VirtualizerInputHandles, VirtualizerProperties>;
