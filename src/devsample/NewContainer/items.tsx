import { Header, Icon, Comment } from "./components";
import React from "react";

const lines = [
    "This is a short line",
    "This is a much longer line that should wrap around to the next row",
    "Medium length section of text here",
    "Very short",
    "Extremely long sentence here which will probably wrap around to a total of three lines or more and it's also a run-on sentence.",
];

let items = new Array(10000).fill(null).map((value, index) => {
    let itemsPerSection = 20;
    let section = Math.floor(index / itemsPerSection);
    let key = `${index}`;
    if (index % itemsPerSection === 0) {
        return <Header key={key}>Section {section}</Header>;
    }
    else {
        if (Math.floor(index / 12) % 2 === 0) {
            return <Icon key={key} image={`https://picsum.photos/id/${index % 50}/200/200`} />
        }
        else {
            return <Comment key={key}>{lines[index % lines.length]}</Comment>
        }
    }
})

export default items;
