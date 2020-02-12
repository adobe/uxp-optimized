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
import React, { useState, forwardRef, Ref, MutableRefObject } from "react";
import ReactDOM from "react-dom";
import Container, { ContainerInputHandles } from "../../Virtualizer";
import "./CssLayout.css";

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

let items: any[] = [];
let itemsPerSection = 20;
for (let section = 0; section < 100; section++) {
    // for (let i = 0; i < 300; i++) {
        items.push({ key: String(- section - 1), type: "row", row: `Section Header: ${section}`})
    // }
    for (let i = 0; i < itemsPerSection; i++) {
        items.push(getRecord(section * itemsPerSection + i));
    };
}

export default forwardRef(function CssLayout(props, ref) {
    return <Container id="virtualizer" items={items} itemKey="key" itemType="type" className="SampleContainer" ref={ref}>
        {
            item => item.row
                ? <Row>{item.row}</Row>
                : <img className="SampleCell" src={item.images[0]} title={item.text}></img>
        }
    </Container>;
})
