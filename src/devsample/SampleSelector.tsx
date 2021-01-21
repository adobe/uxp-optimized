/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import React, { useState, useRef, Ref } from "react";
import ReactDOM from "react-dom";
import CssLayout from "./ProgressiveCss/CssLayout";
import ManualLayout from "./ManualLayout/ManualLayout";
import FlowLayout from "./FlowLayout";
import Horizontal from "./Horizontal";
import { VirtualizerInputHandles, VirtualizerProperties } from "../Virtualizer"

const samples = {
    horizontal: { name: "Horizontal", container: Horizontal },
    flow: { name: "Flow Layout", container: FlowLayout },
    css: { name: "Progressive Css Layout", container: CssLayout },
    manual: { name: "Manual Layout", container: ManualLayout },
}

function SampleSelector(props) {

    const [option, setOption] = useState(Object.keys(samples)[0]);
    const [duration, setDuration] = useState(0.5);
    const [position, setPosition] = useState(0.0);
    const SampleLayout = samples[option].container;
    const sampleRef = useRef<VirtualizerInputHandles>();

    return <div style={{display:"flex", flexDirection:"column", flex: "1"}}>
        <div style={{flex: "0 0 auto"}}>
            <select
                id="sampleSelect"
                defaultValue={option}
                style={{flex: 0}}
                onChange={e => setOption(e.target.value)}
            >
                {
                    Object.keys(samples).map(id => {
                        return (
                            <option value={id} key={id}>{samples[id].name}</option>
                        );
                    })
                }
            </select>
            <select
                id="duration"
                style={{flex: 0}}
                onChange={e => setDuration(parseFloat(e.target.value))}
            >
                <option value="1.0" key="1.0">Scroll 1.0</option>
                <option selected value="0.5" key="0.5">Scroll 0.5</option>
                <option value="0" key="0">Scroll 0 (immediate)</option>
            </select>
            <select
                id="position"
                style={{flex: 0}}
                onChange={e => setPosition(parseFloat(e.target.value))}
            >
                <option selected value="0" key="0.0">Top (0.0)</option>
                <option value="0.5" key="0.5">Middle (0.5)</option>
                <option value="1.0" key="1.0">Bottom (1.0)</option>
            </select>
            <button onClick={() => {
                let virtualizer = sampleRef.current!
                let keys = virtualizer.getRenderKeys();
                console.log(keys);
                console.log(keys.map(key => virtualizer.getItemRect(key)));
            }}>Get Render Items and Bounds</button>
            {
                [0, 20, 40, 60, 80, 81, 82, 83, 84, 85].map(headerIndex => {
                    let key = String(- headerIndex - 1);
                    return <button key={key} onClick={() => {
                        sampleRef.current!.scrollToItem(key, { duration, position });
                    }}>ScrollToCell Header {headerIndex}</button>
                })
            }
        </div>
        <SampleLayout ref={sampleRef} />
    </div>

}

ReactDOM.render(<SampleSelector />, document.getElementById("newReactContainer"));
