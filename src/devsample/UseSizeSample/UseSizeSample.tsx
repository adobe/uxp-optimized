/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import React, { useState, forwardRef, useRef } from "react";
import { useSize } from "../../react";

function Growable() {

    let ref = useRef<HTMLDivElement>(null);
    let [size, setSize] = useState(0);
    useSize(ref, (element) => {
        setSize(element.clientHeight);
    })
    let [count, setCount] = useState(0);

    return (
    <div ref={ref} style={{border: "solid 1px black", padding: 8}}>
        <p>
        My size is: {size}.<br/>
        <button onClick={() => setCount(count+1)}>Add Child</button>
        </p>
        {new Array(count).fill(null).map((n, index) => {
            return <Growable key={index} />
        })}
    </div>);
}

export default forwardRef(function UseSizeSample(props, ref) {
    return <div>
        Click to add children. The size displayed should change in response.
        <Growable />
    </div>
})
