
const lines = [
    "short line",
    "slightly longer line",
    "way longer line than others",
    "short",
    "medium length line",
];

let items = new Array(10000).fill(null).map((value, index) => {
    let itemsPerSection = 20;
    let section = Math.floor(index / itemsPerSection);
    if (index % itemsPerSection === 0) {
        return {
            key: `${-1 - section}`,
            type: "Header",
            text: `Section ${section}` };
    }
    else {
        if (Math.floor(index / 12) % 2 === 0) {
            return {
                key: `${index}`,
                type: "Icon",
                image: `https://picsum.photos/id/${index % 50}/200/200`
            };
        }
        else {
            return {
                key: `${index}`,
                type: "Comment",
                text: lines[index % lines.length]
            };
        }
    }
})

export default items;
