const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const production = false;

module.exports = {
    entry: {
        client: "./src/ts/client/client.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ]
    },
    // externals: {
    //     // TODO check names
    //     "react": "React",
    //     "react-dom": "ReactDOM",
    //     "react-router": true,
    //     "react-router-dom": true,
    // },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/html/index.html",
            hash: true,
            cache: true,
            favicon: "./src/data/favicon.ico",
            showErrors: !production,
            minify: production && {
                caseSensitive: false,
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                conservativeCollapse: false,
                customAttrAssign: [],
                // customAttrCollapse: undefined,
                customAttrSurround: [],
                // customEventAttributes: [],
                decodeEntities: true,
                html5: true,
                ignoreCustomComments: [],
                ignoreCustomFragments: [],
                includeAutoGeneratedTags: true,
                keepClosingSlash: false,
                maxLineLength: Number.MAX_SAFE_INTEGER,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                preserveLineBreaks: false,
                preventAttributesEscaping: false,
                processConditionalComments: true,
                processScripts: [],
                quoteCharacter: "\"",
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeEmptyElements: false,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeTagWhitespace: false,
                sortAttributes: true,
                sortClassName: true,
                trimCustomFragments: true,
                useShortDoctype: true,
            },
        }),
    ],
    mode: production ? "production" : "development",
};