Verified facts:
- Using unique keys DOES result in document.createElement being called for new items.
- document.createElement is very slow in torq-native.
- Recycling keys can result in unintended state sharing between item react components as they are interpreted by React as the same element.

------
RS3 UXP Overrides

replacing @adobe/spectrum-css-temp with @adobe/spectrum-css

https://git.corp.adobe.com/torq/torq-native/tree/feature/spectrum_uxp_components/js/app/demos/spectrum

Steps to provide UXP Specific React Spectrum 3 Component Implementations, using Button as a sample.

1. Verify the component has been published yet. https://www.npmjs.com/search?q=%40react-spectrum
2. Check which components are present in the module.
    https://github.com/adobe-private/react-spectrum-v3/tree/master/packages/%40react-spectrum/button/src
3. Add dependencies on the RS3 Button (and the aria, types and stately packages if present)
    yarn add @react-spectrum/button
    yarn add @react-aria/button
    yarn add @react-types/button
    yarn add @react-stately/button # this one may not exist
4. Create a new button/index.ts file and re-export values from @react-spectrum/button
    export * from '@react-spectrum/button';
5. For each sub file you are going to override. For this sample we are choosing Button
   - Copy the source code from https://github.com/adobe-private/react-spectrum-v3/blob/master/packages/%40react-spectrum/button/src/Button.tsx
   - Paste it into a file with the same name in the same directory as index.ts
   - Edit the file to make UXP specific changes.
   - Override that export in the index.ts file from step 4. File should now look like this:
    export * from '@react-spectrum/button';
    export { Button } from './Button';

TODO:
    Use a --container-width custom css property to allow css to specify column count with an evaluation.