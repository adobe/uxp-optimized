import "./App.css";
import React, { useState, forwardRef } from "react";
import Virtualizer from "../../Virtualizer";
import defaultItems from "./items";
import * as components from "./components";

export default forwardRef(function App(props, ref) {

    const [items, setItems] = useState(defaultItems);
    // we will pass this to children so they can modify their item state.
    const updateItem = (item, props) => {
        let index = items.indexOf(item);
        let newItem = { ...item, ...props };
        let newItems = items.slice(0);
        newItems[index] = newItem;
        setItems(newItems);
        console.log("updateItem", item, props);
    }

    return <div className="App">
        <p>
        Virtualizer Sample.
        </p>
        <Virtualizer
            id="virtualizer"
            items={items}
            itemKey="key"
            itemType="type"
            className="Virtualizer"
            style={{ width: 500, height: 500 }}
            ref={ref}
            onLayout={() => {
                console.log("on layout");
            }}
        >
            {
                item => {
                    let Component = components[item.type];
                    return <Component item={item} updateItem={updateItem} />;
                }
            }
        </Virtualizer>
    </div>

})
