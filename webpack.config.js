var path = require('path');
var webpack = require('webpack');



module.exports = {
    entry: "./app/entry.js",
    output: {
        path: path.join(__dirname, "/public/assets"),
        filename: "bundle.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'DATA_SRC': JSON.stringify(process.env.DATA_SRC)
            }
        })
    ]
};
