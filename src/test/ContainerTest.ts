/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/
import path from "path";
import { after, before, describe, it } from "mocha";
import { strict as assert } from "assert";
import { JSDOM } from "jsdom";
import { getSampleItems, getSampleContainer } from "./SampleContainer";

const testHtml = path.join(__dirname, "../../src/test/test.html");
declare const global: NodeJS.Global & any;

const containerHeight = 400;
const backwardPrerender = 100;
const forwardPrerender = 500;
const itemHeight = 50;

describe('Container', function() {
    let dom: JSDOM;
    let ReactDOM;
    before(async () => {
        dom = await JSDOM.fromFile(testHtml);
        global.dom = dom;
        global.window = dom.window;
        global.document = window.document;
        global.navigator = dom.window.navigator;
        ReactDOM = require("react-dom");
    })
    describe('window', () => {
        it('should exist', () => {
            assert(global.window != null);
        });
    });
    describe('document', () => {
        it('should exist', () => {
            assert(global.window != null);
        });
    });
    describe('React Element', () => {
        it("should render initial items and respond to scrolling", async () => {
            // dom.window.document.body.clientHeight = 800;
            let target = document.getElementById("app");
            // we have to stub clientHeight on the target or Virtualizer won't render
            Object.defineProperties(dom.window.HTMLElement.prototype, {
                clientHeight: {
                    get() {
                        return this.parentElement === target ? containerHeight : itemHeight;
                    }
                }
            })
            if (target == null) {
                throw new Error("Element doesn't exist");
            }
            ReactDOM.render(getSampleContainer(getSampleItems()), target);
            let container = target.firstElementChild as HTMLDivElement;
            // simulate stuff.
            let placeholderCount = 1;
            function children() {
                return Array.from(container.children).slice(placeholderCount) as HTMLElement[];
            }
            function scroll(top: number) {
                container.scrollTop = top;
                container.dispatchEvent(new dom.window.CustomEvent('scroll'));
            }
            function getAveragePosition(children: HTMLElement[]) {
                let total = 0;
                for (let child of children) {
                    let topStyle = child.style.top;
                    assert(typeof topStyle === "string");
                    assert(topStyle.endsWith("px"));
                    let top = parseInt(topStyle);
                    assert(top >= 0);
                    total += top;
                }
                return Math.round(total / children.length);
            }
            //  initial amount of rendered children should be more than one page and less than two pages.
            //  any more would delay rendering too much.
            const expectedItemsPerPage = containerHeight / itemHeight;
            assert(expectedItemsPerPage > 0);
            assert(children().length > expectedItemsPerPage);
            assert(children().length < expectedItemsPerPage * 2);

            const childrenBeforeScroll = children().length;

            // trigger scroll event.
            scroll(containerHeight);

            const childrenAfterScroll1 = children().length;
            // there should be more children rendered after the initial scroll event.
            assert(childrenAfterScroll1 > childrenBeforeScroll);

            // now scrollBackToTheTop
            scroll(0);
            // there should be the same number of children as rendered after the first scroll.
            //  this is because we don't need
            const childrenAfterScroll2 = children().length;
            assert(childrenAfterScroll1 === childrenAfterScroll2);

            // now we are going to scroll 20 times 1/2 a page distance.
            let counts: number[] = []
            for (let i = 0; i < 20; i++) {
                let pageTop = i * containerHeight / 2;
                let pageBottom = pageTop + containerHeight;
                scroll(pageTop);
                counts.push(children().length);
                // check that children have valid positions
                //  and the average position is now lower
                let averagePosition = getAveragePosition(children());
                //  ensure that the average position of rendered elements is somewhere
                //  between the visible top and the next page (in case we are pre-rendering a lot of items)
                assert(averagePosition > pageTop);
                assert(averagePosition < pageBottom + containerHeight);
            }

            //  verify that the last 10 sizes are all the same amount of children.
            //  this shows that we are recycling elements.
            const lastTotal = counts.slice(-10).reduce((a, b) => a + b, 0);
            assert(lastTotal / 10 === counts[counts.length - 1]);
        });

        it("should not render items that are not visible", async () => {
            const target = document.getElementById("app")!;

            // Make the first item really big - we want to make sure it's rendered if partially visible, but
            // other items that are completely off-screen are not rendered.
            const items = getSampleItems();
            items[0].rect.height = 10000;

            ReactDOM.render(getSampleContainer(items), target);
            const container = target.firstElementChild as HTMLDivElement;

            // Scroll so the first item is still visible, but many items on the way are not visible
            const scrollTop = 7000;
            container.scrollTop = scrollTop;
            container.dispatchEvent(new dom.window.CustomEvent('scroll'));

            // Only visible elements should be rendered (including the prerender windows)
            const topVisible = scrollTop - backwardPrerender;
            const bottomVisible = scrollTop + containerHeight + forwardPrerender;
            function checkVisible(element: HTMLElement) {
                const top = parseInt(element.style.top);
                const height = parseInt(element.style.height);
                // Note: There's a window of the container height above/below the viewable region that we still render
                assert(top <= bottomVisible && top + height >= topVisible);
            }

            const children = Array.from(container.children).slice(1) as HTMLElement[];
            children.forEach(checkVisible);
            assert(children.length === 22);
        });

        it("should support scrollBy", async () => {
            const target = document.getElementById("app")!;

            let scrollerAPI;
            const items = getSampleItems();
            ReactDOM.render(getSampleContainer(items, api => scrollerAPI = api), target);
            const container = target.firstElementChild as HTMLDivElement;
            container.scrollTop = 0;

            // JSDOM doesn't set scrollHeight, so we have to fake it:
            Object.defineProperty(container, 'scrollHeight', { get: () => 1000 });

            // JSDOM doesn't implement scrollTo, so we have to fake it:
            container.scrollTo = (options?) => container.scrollTop = options.top;

            scrollerAPI.scrollBy(100);
            assert(container.scrollTop === 100);

            scrollerAPI.scrollBy(-50);
            assert(container.scrollTop === 50);

            scrollerAPI.scrollBy(-100);
            assert(container.scrollTop === 0);

            scrollerAPI.scrollBy(1000);
            assert(container.scrollTop === 600); // Max is scrollHeight - clientHeight
        });
    });

    after(() => {
        delete global.window;
        delete global.document;
    });
});
