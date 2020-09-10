/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/
import { getItems, Record } from "./sampleLines";
import React, { useState, useRef } from "react";
import Container from "../Virtualizer";

function Row(properties: { children: string, [other: string]: any }) {
    let { children, ...otherProps } = properties;
    let [selected, setSelected] = useState(false);
    return (
        <div
            className={`SampleRow${selected ? " selected" : ""}`}
            onClick={() => setSelected(!selected) }
            {...otherProps}
        >{children}</div>
    );
}

export function getSampleItems() {
    let items: any[] = [];
    let itemsPerSection = 20;
    for (let section = 0; section < 100; section++) {
        // for (let i = 0; i < 300; i++) {
            items.push({ key: String(- section - 1), type: "row", row: `Section Header: ${section}`})
        // }
        for (let i = 0; i < itemsPerSection; i++) {
            items.push(getItems(section * itemsPerSection + i));
        };
    }
    //  now add absolute position rects to all items to simulate external cc-library style positioning.
    //  also because jsdom doesn't actually perform any layout.
    for (let i = 0; i < items.length; i++) {
        const height = 50;
        items[i].rect = { x: 0, y: i * height, width: 800, height };
    }
    return items;
}

export function getSampleContainer(items, getAPI?) {
    return <Container items={items} itemKey="key" itemType="type" itemRect="rect" className="SampleContainer" ref={ getAPI }>
        {
            item => item.row
                ? <Row>{item.row}</Row>
                : <img className="SampleCell" src={item.images[0]} title={item.text}></img>
        }
    </Container>;
}
