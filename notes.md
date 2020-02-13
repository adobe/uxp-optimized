Verified facts:
- Using unique keys DOES result in document.createElement being called for new items.
- document.createElement is very slow in torq-native.
- Recycling keys can result in unintended state sharing between item react components as they are interpreted by React as the same element.
