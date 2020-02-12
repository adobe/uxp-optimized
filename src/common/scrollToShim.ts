/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/


if (typeof Element !== "undefined" && Element.prototype.scrollTo == null) {
    /**
     * Scrolls the element to the new x and y positions. If options object is used with behavior: "smooth" then the element is smoothly scrolled.
     * @param {*} xOrOptions either the new scrollLeft position or an options object.
     * @param {*} y the optional new scrollTop position.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
     */
    (Element.prototype as any).scrollTo = function scrollTo(this: Element, xOrOptions, y) {
        let x;
        let behavior = "auto";
        if (typeof xOrOptions === "object" && xOrOptions != null) {
            behavior = xOrOptions.behavior;
            x = xOrOptions.left;
            y = xOrOptions.top;
        }
        if (x == null) {
            x = this.scrollLeft;
        }
        if (y == null) {
            y = this.scrollTop;
        }
        cancelSmoothScrolling(this);
        if (behavior === "smooth") {
            beginSmoothScrolling(this, x, y);
        }
        else {
            this.scrollLeft = x;
            this.scrollTop = y;
        }
    }
}

const scrollToAnimateId = Symbol("Element.scrollToAnimateId");
function cancelSmoothScrolling(element) {
    if (element[scrollToAnimateId] != null) {
        cancelAnimationFrame(element[scrollToAnimateId]);
        element[scrollToAnimateId] = null;
    }
}

function beginSmoothScrolling(element, x, y) {
    const duration = 0.5;
    const startX = element.scrollLeft;
    const startY = element.scrollTop;
    //  we use the parametric function to provide ease-in-out
    const parametricBlend = (t, p = 1.8) => t ** p / (t ** p + (1 - t) ** p);
    const lerp = (a, b, alpha) => Math.round(a + (b - a) * alpha);
    const start = Date.now();
    const animatePosition = () => {
        const time = Date.now();
        const deltaTime = (time - start) / 1000;
        const alpha = parametricBlend(Math.min(1, deltaTime / duration));
        element.scrollLeft = lerp(startX, x, alpha);
        element.scrollTop = lerp(startY, y, alpha);
        if (alpha < 1) {
            element[scrollToAnimateId] = requestAnimationFrame(animatePosition);
        }
        else {
            element[scrollToAnimateId] = null;
        }
    };
    animatePosition();
}