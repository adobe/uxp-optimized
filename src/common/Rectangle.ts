/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import Margin from "./Margin";
import Rect from "./Rect";

export default class Rectangle implements Rect {

    x: number
    y: number
    width: number
    height: number

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    add(margin: Margin) {
        return new Rectangle(
            this.x - margin.left,
            this.y - margin.top,
            this.width + margin.left + margin.right,
            this.height + margin.top + margin.bottom);
    }

    subtract(margin: Margin) {
        return new Rectangle(
            this.x + margin.left,
            this.y + margin.top,
            this.width - margin.left - margin.right,
            this.height - margin.top - margin.bottom);
    }

    toString() {
        return `Rectangle(${this.x},${this.y},${this.width},${this.height})`
    }

}
