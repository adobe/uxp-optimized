Verified facts:
- Using unique keys DOES result in document.createElement being called for new items.
- document.createElement is very slow in torq-native.
- Recycling keys can result in unintended state sharing between item react components as they are interpreted by React as the same element.

Known issues and TODO:

TODO: Move these into actual issues to track.

- Must handle focus using document.activeElement
- Need a solution for state since using indexes for keys makes elements share state unintentionally.
- UXP is providing one or more frames of invalid css margin when resizing. Causes flicker.
