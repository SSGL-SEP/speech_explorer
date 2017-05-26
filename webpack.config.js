var path = require('path');

module.exports = {
    entry: "./app/entry.js",
    output: {
        path: path.join(__dirname, "/public/assets"),
        filename: "bundle.js"
    }
};
