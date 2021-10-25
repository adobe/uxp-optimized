
const lines = [
    "This is a short line",
    "This is a much longer line that should wrap around to the next row",
    "Medium length section of text here",
    "Very short",
    "Extremely long sentence here which will probably wrap around to a total of three lines or more and it's also a run-on sentence.",
];

export const headerType = "Header";
export const iconType = "Icon";
export const commentType = "Comment";

let items = new Array(10000).fill(null).map((value, index) => {
    let itemsPerSection = 20;
    let section = Math.floor(index / itemsPerSection);
    if (index % itemsPerSection === 0) {
        return {
            key: `${-1 - section}`,
            type: headerType,
            text: `Section ${section}` };
    }
    else {
        if (Math.floor(index / 12) % 2 === 0) {
            return {
                key: `${index}`,
                type: iconType,
                image: `https://picsum.photos/id/${index % 50}/200/200`
            };
        }
        else {
            return {
                key: `${index}`,
                type: commentType,
                text: lines[index % lines.length]
            };
        }
    }
})

export default items;
