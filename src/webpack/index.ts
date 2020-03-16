import { buildConfig, uxp } from "@torq-native/webpack-builder";
import fs from "fs";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

type Options = {
    /**
     * The path to this projects root directory.
     * Must contain a package.json file.
     */
    project: string,
    production: any,
    version: any,
};

export function helper(options: Options, config?: any) {
    const { project: root, production, version } = options;
    const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    const SRC = path.join(root, "src");
    const DEST = path.join(root, "dist");
    const fullVersion = version || packageJson.version;

    return buildConfig({
        production,

        context: root,
        destination: DEST,

        /**
         * Disable to remove the cache errors from  HardSourceWebpackPlugin.
         * It does have some problems with local linking delete
         * /node_modules/.cache/ when experiencing cache errors.
         * but can speed up sub-sequent builds.
         */
        disableHardSource: false,

        entry: {
            app: [ path.join(SRC, 'index.tsx') ],
        },

        libraries: [
            // require('./webpack.helper.js'),
            require('@torq-native/react-spectrum/webpack.helper.js'),
        ],

        config: {
            plugins: [
                new HtmlWebpackPlugin({
                    title: 'uxp-starter-pack',
                    appVersionNumber: fullVersion,
                    template: path.join(SRC, 'index.html'),
                }),

                uxp.manifest({
                    template: path.resolve(SRC, 'manifest.json'),
                    version: fullVersion,
                }),

                uxp.debug_json({
                    skip: production,
                    template: path.resolve(SRC, 'debug.json'),
                }),
            ],
            resolve: {
                // Add '.ts' and '.tsx' as resolvable extensions.
                extensions: [".ts", ".tsx", ".js", "/index.js"]
            },
            module: {
                rules: [
                    {
                        test: /\.ts(x?)$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: "ts-loader"
                            }
                        ]
                    },
                    // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                    {
                        enforce: "pre",
                        test: /\.js$/,
                        loader: "source-map-loader"
                    },
                    {
                        test:/\.css$/,
                        use:['style-loader','css-loader']
                    },
                    {
                        test: /\.s(a|c)ss$/,
                        exclude: /\.module.(s(a|c)ss)$/,
                        loader: [
                          'style-loader',
                          'css-loader',
                          'sass-loader'
                        ]
                    },
                    {
                        test: /\.(png|svg|jpg|gif)$/,
                        use: [
                            'file-loader'
                        ]
                    }            
                ]
            }
        },
    });
}