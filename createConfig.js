var targetJSON = "public/config.json";
var fs = require('fs');

if (fs.existsSync(targetJSON)) {
    console.log("createConfig.js --> using old config.json.");
    process.exit(1);
}

var dataFolder = 'public/data';
var datasets = [];

function createDataSet(dn, ds, pm, tp, dsr, asr) {
    var newObj = new Object();
    newObj.displayName = dn;
    newObj.dataSet = ds;
    newObj.processingMethod = pm;
    newObj.totalPoints = tp;
    newObj.dataSrc = dsr;
    newObj.audioSrc = asr;
    return newObj;
};

function createConfigObject(dataSets, defaultSet) {
    var newObj = new Object();
    newObj.dataSets = dataSets;
    newObj.defaultSet = defaultSet;
    return newObj;
}

fs.readdirSync(dataFolder).forEach(function(file) {
    var obj = JSON.parse(fs.readFileSync(dataFolder + '/' + file, 'utf8'));
    var dnCandidate = obj.dataSet + '_' + obj.processingMethod; //TODO: check for doubles
    var temp = createDataSet(dnCandidate, obj.dataSet, obj.processingMethod, obj.totalPoints, 'data/' + file, obj.dataSet);
    datasets.push(temp);
});

var newconfig = JSON.stringify(createConfigObject(datasets, 0), null, 2);


fs.writeFile(targetJSON, newconfig, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log("createConfig.js --> created new config.json!");
});
