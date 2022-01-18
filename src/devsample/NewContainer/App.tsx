import "./App.css";
import React, { useState, forwardRef, FunctionComponent } from "react";
import Container from "../../Virtualizer/Container";
import items from "./items";

type ItemProperties = { recycleType: string, index: number, background: string}
const Item: FunctionComponent<ItemProperties> = (props: { recycleType: string, index: number, background: string}) => {
    let { recycleType, index, background, ...rest } = props;
    return <div style={{background}} {...rest}>{recycleType} {index}</div>
}

export default forwardRef(function App(props, ref) {
    return (
        <div className="Container_App">
            <p>
            Container Sample.
            </p>
            <Container ref={ref} className="Virtualizer" style={{ width: "100%", height: 500, background: "orange" }}>
                { items }
            </Container>
        </div>
    );
})