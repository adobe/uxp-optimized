/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

export type ResizeObserverEntry = {
    target: Element
    contentRect: Readonly<DOMRect>
}

export type ResizeObserverOptions = {
    box?: "border-box" | "content-box" | "device-pixel-content-box"
}

export type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: UxpResizeObserver) => void

export class UxpResizeObserver {

    elements: Set<Element>
    pendingEntries: ResizeObserverEntry[]
    externalObserver: ResizeObserverCallback
    internalObserver: (this: Element) => void
    queuedCallback: () => void
    queuedCallbackId: any

    constructor(callback: ResizeObserverCallback) {
        const resizeObserver = this;
        this.elements = new Set();
        this.pendingEntries = []
        this.externalObserver = callback;
        this.internalObserver = function() {
            let element = this as HTMLElement;
            let width = element.offsetWidth;
            let height = element.offsetHeight;
            resizeObserver.queueCallback({ target: element, contentRect: new DOMRect(0, 0, width, height) });
        }
        this.queuedCallback = () => {
            this.queuedCallbackId = null;
            if (this.pendingEntries.length > 0) {
                let entries = this.pendingEntries;
                this.pendingEntries = [];
                callback(entries, this);
            }
        }
    }
    queueCallback(entry: ResizeObserverEntry) {
        this.pendingEntries.push(entry);
        if (this.queuedCallbackId == null) {
            this.queuedCallbackId = setTimeout(this.queuedCallback, 0);
        }
    }
    observe(element: Element, options?: ResizeObserverOptions) {
        if (options != null && options.box !== "border-box") {
            console.warn(`ResizeObserver shim only supports 'border-box', not ${options.box}`);
        }
        element.addEventListener("resize", this.internalObserver);
        this.elements.add(element);
    }
    unobserve(element: Element) {
        if (this.elements.has(element)) {
            element.removeEventListener("resize", this.internalObserver);
            this.elements.delete(element);
        }
    }
    disconnect() {
        for (let element of this.elements.values()) {
            this.unobserve(element);
        }
    }
}

let ResizeObserver = UxpResizeObserver

declare global {
    interface Window {
        ResizeObserver: typeof ResizeObserver
    }
}

if (typeof window !== "undefined") {
    if (window.ResizeObserver == null) {
        window.ResizeObserver = ResizeObserver;
    }
    else {
        ResizeObserver = window.ResizeObserver as any;
    }
}

export default ResizeObserver as typeof window.ResizeObserver
