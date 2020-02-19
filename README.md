Uxp Optimized
=============

### Introduction

`Uxp Optimized` is a library of browser compatible react components specifically optimized for Adobe's Unified Extensibility Platform.

### Installation

    npm install @adobe/uxp-optimized

or

    yarn add @adobe/uxp-optimized

### Virtualizer

A react virtualizer for efficiently rendering long lists of items. Similar to react-virtualized.

#### Usage

[Virtualizer API](./src/Virtualizer/VirtualizerApi.ts)

    import Virtualizer from "@adobe/uxp-optimized/Virtualizer";

    //  1. Create your items.
    let items = [
        { key: "a", type: "comment", text: "Comment 1"},
        { key: "b", type: "comment", text: "Comment 2"},
        { key: "c", type: "image", image: "./path/to/image.png"},
        ...
    ];

    //  2. Create the Virtualizer
    return <Virtualizer
        items={items}
        itemKey="key"
        itemType="type"
        style={{ width: 500, height: 500}}
    >
    {
        //  3. Provide a function to convert items to react components.
        item => item.type === "comment" ? <div class="comment">{item.text}</div> : <img src={item.image}></img>;
    }
    </Virtualizer>


#### Samples

[Basic Flow Layout Sample](./src/devsample/FlowLayout/App.tsx)

[Progressive Css Layout Sample](./src/devsample/ProgressiveCss/CssLayout.tsx)

### Development

#### Installation
    git clone https://github.com/adobe/uxp-optimized.git
    cd uxp-optimized
    yarn install

#### Testing in browser

    yarn watch_sample

Open [http://localhost:1234](http://localhost:1234) in your browser.

Note: The browser must currently support ResizeObserver api.

#### Testing on UXP

Install torq-native in a peer directory and then run:


    ./watch.sh

This should launch the sample in the UXP demo as a plugin.

### Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
