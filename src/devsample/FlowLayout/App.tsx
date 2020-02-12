import "./App.css";
import React from "react";
import Virtualizer from "../../Virtualizer";
import items from "./items";

export default class App extends React.Component {

    render() {
        return <div className="App">
            <p>
            Virtualizer Sample.
            </p>
            <Virtualizer id="virtualizer" items={items} itemKey="key" itemType="type" style={{ width: 500, height: 500, background: 'orange' }}>
                {
                    item => {
                        switch (item.type) {
                            case "header":
                                return <div className="SampleHeader">{ item.text }</div>
                            case "image":
                                return <img className="SampleImage" src={ item.image }></img>
                            case "comment":
                            default:
                                return <div className="SampleComment">{ item.text }</div>
                        }
                    }
                }
            </Virtualizer>
        </div>
    }

}