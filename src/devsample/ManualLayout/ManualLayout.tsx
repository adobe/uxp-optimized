/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import { getRecord, Record } from "../lines";
import React, { useState, forwardRef } from "react";
import Virtualizer from "../../Virtualizer";
import "./ManualLayout.css";

function Row(properties: { children: string, [other: string]: any }) {
    let { children, ...otherProps } = properties;
    let [selected, setSelected] = useState(false);
    return (
        <div
            className={`ManualSampleRow${selected ? " selected" : ""}`}
            onClick={() => setSelected(!selected) }
            {...otherProps}
        >{children}</div>
    );
}

let items: any[] = [];
let itemsPerSection = 20;
for (let section = 0; section < 100; section++) {
    items.push({ key: String(- section - 1), type: "row", row: `Section Header: ${section}`})
    for (let i = 0; i < itemsPerSection; i++) {
        items.push(getRecord(section * itemsPerSection + i));
    };
}
// manual layout code
let x = 0, y = 0;
let margin = 10;
let layoutWidth = 700;
let cellSize = 50;
let titleSize = 20;
let newLine = () => {
    x = 0;
    y += cellSize + margin;
}
for (let item of items) {
    if (item.type === "cell") {
        if (x >= layoutWidth - cellSize - margin) {
            newLine();
        }
        item.rect = { x: x + margin * 2, y: y + margin, width: cellSize, height: cellSize };
        x += cellSize + margin;
    }
    else {
        if (y > 0) {
            y += margin * 2;
            newLine();
        }
        else {
            y += margin;
        }
        item.rect = { x: x + margin, y: y, width: layoutWidth, height: titleSize + 2 * cellSize + 3 * margin };
        y += titleSize;
    }
}

export default forwardRef(function ManualLayout(props, ref) {
    return <Virtualizer
            id="virtualizer"
            items={items}
            itemKey="key"
            itemType="type"
            itemRect="rect"
            className="ManualSampleContainer"
            ref={ref}
    >
        {
            item => item.row
                ? <Row>{item.row}</Row>
                : <img className="ManualSampleCell" src={item.images[0]} title={item.text}></img>
        }
    </Virtualizer>;
})
