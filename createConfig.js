var targetJSON = "public/config.json"; 
var dataFolder = 'public/data';
var dataSources = new Set();
var datasets = [];
var fs = require('fs');
var temp, obj;
var newJSONs = false;
var oldDataOK = true;


function createConfig() {
    if (fs.existsSync(targetJSON)) {
        try {
            var oldData = JSON.parse(fs.readFileSync(targetJSON, 'utf8'));
            console.log('createConfig: ' + oldData.dataSets.length + ' files in ' + dataFolder + '.');
        } catch(e) {
            console.log('createConfig: ' + e.message);
            oldDataOK = false;

        }
        if (oldDataOK) {
            for (var i = 0; i < oldData.dataSets.length; i++) {
                obj = oldData.dataSets[i];
                dataSources.add(obj.dataSrc);
                temp = createDataSet(obj.displayName, obj.dataSet, obj.processingMethod, obj.totalPoints, obj.dataSrc, obj.audioSrc);
                datasets.push(temp);
            }
        }
    }

    function createDataSet(dn, ds, pm, tp, dsr, asr) {
        var newObj = new Object();
        newObj.displayName = dn;
        newObj.dataSet = ds;
        newObj.processingMethod = pm;
        newObj.totalPoints = tp;
        newObj.dataSrc = dsr;
        newObj.audioSrc = asr;
        return newObj;
    }

    function createConfigObject(dataSets, defaultSet) {
        var newObj = new Object();
        newObj.dataSets = dataSets;
        newObj.defaultSet = defaultSet;
        return newObj;
    }

    fs.readdirSync(dataFolder).forEach(function(file) {
        obj = JSON.parse(fs.readFileSync(dataFolder + '/' + file, 'utf8'));
        var dnCandidate = obj.dataSet + ' (' + obj.processingMethod + ')';
        var dsr = 'data/' + file;
        if (!dataSources.has(dsr)) {
            var temp = createDataSet(dnCandidate, obj.dataSet, obj.processingMethod, obj.totalPoints, dsr, obj.dataSet);
            datasets.push(temp);
            newJSONs = true;
        }
    });

    if (newJSONs) {
        var newconfig = JSON.stringify(createConfigObject(datasets, 0), null, 2);
        fs.writeFile(targetJSON, newconfig, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("createConfig: Created new config.json with " + datasets.length + ' datasets in it.');
        });
    } else { console.log("createConfig: Using old config.json.") }
}

createConfig();