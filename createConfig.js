var targetJSON = 'public/config.json'; 
var dataFolder = 'public/data';

var oldDataSources = new Set();
var newDataSources = new Set();
var datasets = new Map();
var fs = require('fs');
var temp, obj;
var newJSONs = false;
var oldConfigOK = true;

/**
* Adds and removes entries from targetJSON based on what json -files are present at dataFolder 
*
*/
function createConfig() {
    if (fs.existsSync(targetJSON)) {
        try {
            var oldData = JSON.parse(fs.readFileSync(targetJSON, 'utf8'));
            console.log('createConfig: ' + oldData.dataSets.length + ' datasets in old config file.');
        } catch(e) {
            console.log('createConfig: ' + e.message);
            oldConfigOK = false;
        }
        if (oldConfigOK) {
            for (var i = 0; i < oldData.dataSets.length; i++) {
                obj = oldData.dataSets[i];
                oldDataSources.add(obj.dataSrc);
                temp = createDataSet(obj.displayName, obj.dataSet, obj.processingMethod, obj.totalPoints, obj.dataSrc, obj.audioSrc);
                datasets.set(obj.dataSrc ,temp);
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
        newObj.dataSets = [];
        dataSets.forEach (function(value) {
            newObj.dataSets.push(value);
        })
        newObj.defaultSet = defaultSet;
        return newObj;
    }

    fs.readdirSync(dataFolder).forEach(function(file) {
        obj = JSON.parse(fs.readFileSync(dataFolder + '/' + file, 'utf8'));
        var dnCandidate = obj.dataSet + ' (' + obj.processingMethod + ')';
        var dsr = 'data/' + file;
        newDataSources.add(dsr);
        if (!oldDataSources.has(dsr)) {
            var temp = createDataSet(dnCandidate, obj.dataSet, obj.processingMethod, obj.totalPoints, dsr, obj.dataSet);
            datasets.set(dsr ,temp);
            newJSONs = true;
        }
    });

    if (newJSONs || (oldDataSources.size > newDataSources.size)) {
        datasets.forEach( function(element, index) {
            if (!newDataSources.has(index)) {
                datasets.delete(index);
            }
        });


        var newconfig = JSON.stringify(createConfigObject(datasets, 0), null, 2);
        fs.writeFile(targetJSON, newconfig, function(err) {
            if (err) {
                return console.log('createConfig: ' + err);
            }
            console.log("createConfig: Created new config.json with " + newDataSources.size + ' datasets in it.');
        });
    } else { console.log("createConfig: Using old config file."); }
}

createConfig();