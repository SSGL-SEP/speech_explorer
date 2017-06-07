if (process.env.NODE_ENV === 'production') {
    //webpack was build with -p, set base url to amazon s3 for heroku to DL files
}

var Data = require('./Data');
var json;
if (process.env.NODE_ENV === 'development') {
    json = require('../test/testdata200.json');
} else {
    json = require('../data/2D_newformat_full.json');
}
var Visualizer = require("./Visualizer");
var FilterOverlay = require("./FilterOverlay");

Data.loadData(json);
var visualizer = new Visualizer();
visualizer.init();

new FilterOverlay(Data, visualizer.setFilter); // eslint-disable-line no-new
