/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
export function parseCssSize(size: string | null) {
    if (size && size !== "none") {
        if (size.endsWith("px")) {
            return parseFloat(size.slice(0, -2));
        }
        else {
            console.warn("Unsupported units: " + size);
        }
    }
    return 0;
}

export default class Margin {

    left: number
    top: number
    right: number
    bottom: number

    constructor(left: number, top: number = left, right: number = left, bottom: number = top) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    get horizontal() {
        return this.left + this.right;
    }

    get vertical() {
        return this.top + this.bottom;
    }

    //  we are going to memoize these values for performance...
    //  and because they are almost always the same few values.
    static cache = new Map<string,Margin>();

    static fromCssMargin(css: CSSStyleDeclaration) {
        let cacheKey = css.margin || "";
        let cached = Margin.cache.get(cacheKey);
        if (cached == null) {
            Margin.cache.set(cacheKey, cached = new Margin(
                parseCssSize(css.marginLeft),
                parseCssSize(css.marginTop),
                parseCssSize(css.marginRight),
                parseCssSize(css.marginBottom)
            ))
        }
        return cached;
    }

    static fromCssPadding(css: CSSStyleDeclaration) {
        let cacheKey = css.padding || "";
        let cached = Margin.cache.get(cacheKey);
        if (cached == null) {
            Margin.cache.set(cacheKey, cached = new Margin(
                parseCssSize(css.paddingLeft),
                parseCssSize(css.paddingTop),
                parseCssSize(css.paddingRight),
                parseCssSize(css.paddingBottom)
            ))
        }
        return cached;
    }

    toString() {
        return `Margin(${this.left},${this.top},${this.right},${this.bottom})`
    }

}