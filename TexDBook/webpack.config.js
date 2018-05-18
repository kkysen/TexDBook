const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: "index.html",
            template: "./src/html/index.html",
        }),
    ],
    mode: "production",
};