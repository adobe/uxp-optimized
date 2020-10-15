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
import { VirtualizerInputHandles, VirtualizerProperties } from "../Virtualizer"

const samples = {
    flow: { name: "Flow Layout", container: FlowLayout },
    css: { name: "Progressive Css Layout", container: CssLayout },
    manual: { name: "Manual Layout", container: ManualLayout },
}

function SampleSelector(props) {

    const [option, setOption] = useState(Object.keys(samples)[0]);
    const [behavior, setBehavior] = useState("smooth");
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
                id="scrollBehavior"
                style={{flex: 0}}
                onChange={e => setBehavior(e.target.value)}
            >
                <option value="smooth" key="smooth">Scroll smooth</option>
                <option value="auto" key="auto">Scroll auto (immediate)</option>
            </select>
            {
                [0, 20, 40, 60, 80].map(headerIndex => {
                    let key = String(- headerIndex - 1);
                    return <button key={key} onClick={() => {
                        sampleRef.current!.scrollToItem(key, { behavior: behavior as any });
                    }}>ScrollToCell Header {headerIndex}</button>
                })
            }
        </div>
        <SampleLayout ref={sampleRef} />
    </div>

}

ReactDOM.render(<SampleSelector />, document.getElementById("newReactContainer"));
