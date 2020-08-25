// import { buildConfig, uxp } from "@torq-native/webpack-builder";
// import fs from "fs";
// import path from "path";
// import HtmlWebpackPlugin from "html-webpack-plugin";
// // import ResolverPlugin from "./ResolverPlugin";

// //  we have to specify loaders by string,
// //  BUT we don't want to force clients to import all the loaders
// //  so by using require.resolve we allow them to use our packages loaders.
// const sourceMapLoader = require.resolve("source-map-loader");
// const styleLoader = require.resolve("style-loader");
// const cssLoader = require.resolve("css-loader");
// const sassLoader = require.resolve("sass-loader");
// const tsLoader = require.resolve("ts-loader");
// const fileLoader = require.resolve("file-loader");

// type Options = {
//     /**
//      * The path to this projects root directory.
//      * Must contain a package.json file.
//      */
//     project: string,
//     platform: "web" | "uxp",
//     production: any,
//     version: any,
// };

// export function helper(options: Options, config?: any) {
//     const { project: root, production, platform, version } = options;
//     const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
//     const SRC = path.join(root, "src");
//     const DEST = path.join(root, "dist", platform);
//     const fullVersion = version || packageJson.version;

//     const result = buildConfig({
//         production,

//         context: root,
//         destination: DEST,

//         /**
//          * Disable to remove the cache errors from  HardSourceWebpackPlugin.
//          * It does have some problems with local linking delete
//          * /node_modules/.cache/ when experiencing cache errors.
//          * but can speed up sub-sequent builds.
//          */
//         disableHardSource: false,

//         entry: {
//             app: [ path.join(SRC, 'index.tsx') ],
//         },

//         libraries: [
//             // require('./webpack.helper.js'),
//             // require('@torq-native/react-spectrum/webpack.helper.js'),
//         ],

//         config: {
//             plugins: [
//                 new HtmlWebpackPlugin({
//                     appVersionNumber: fullVersion,
//                     template: path.join(SRC, 'index.html'),
//                 }),

//                 uxp.manifest({
//                     template: path.resolve(SRC, 'manifest.json'),
//                     version: fullVersion,
//                 }),

//                 uxp.debug_json({
//                     skip: production,
//                     template: path.resolve(SRC, 'debug.json'),
//                 }),
//             ],
//             resolve: {
//                 // Add '.ts' and '.tsx' as resolvable extensions.
//                 extensions: [".ts", ".tsx", ".js", "/index.js"],
//                 // plugins: platform === "uxp" ? [new ResolverPlugin()] : []
//             },
//             module: {
//                 rules: [
//                     {
//                         test: /\.ts(x?)$/,
//                         exclude: /node_modules/,
//                         use: [ tsLoader ]
//                     },
//                     // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
//                     {
//                         enforce: "pre",
//                         test: /\.js$/,
//                         loader: sourceMapLoader
//                     },
//                     {
//                         test:/\.css$/,
//                         use:[ styleLoader, cssLoader ]
//                     },
//                     {
//                         test: /\.s(a|c)ss$/,
//                         exclude: /\.module.(s(a|c)ss)$/,
//                         loader: [ styleLoader, cssLoader, sassLoader ]
//                     },
//                     {
//                         test: /\.(png|svg|jpg|gif)$/,
//                         use: [ fileLoader ]
//                     }            
//                 ]
//             }
//         },
//     });

//     // we are going to pre-empt the module resolution directories provided by buildConfig
//     //  we want our /lib folder to be searched before the clients node_modules
//     //  this way it will find
//     //  /lib/@react-spectrum/button before node_modules/@react-spectrum/button
//     if (platform === "uxp") {
//         result.resolve.modules.unshift(path.join(__dirname, "../../lib"));
//     }

//     return result;
// }