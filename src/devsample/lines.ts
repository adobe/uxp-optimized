/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const lines = [
    "This is a short line",
    "This is a much longer line that should wrap around to the next row",
    "Medium length section of text here",
    "Very short",
    "Extremely long sentence here which will probably wrap around to a total of three lines or more",
];

export type Record = {
    text: string,
    images: string[]
}

export function getRecord(index: number) {
    return {
        key: String(index),
        type: "cell",
        images: [`https://picsum.photos/id/${index % 50}/200/200`],
        text: index + " " + lines[index % lines.length]
    };
}
