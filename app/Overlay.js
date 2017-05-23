var dat = require("dat.gui/build/dat.gui.min.js");






var Overlay = module.exports = function (tags) {
    var testPhonem = {
        key: "phonem",
        values: ["a", "e", "i", "o", "u"]
    };

    var testVoiced = {
        key: "voiced",
        values: ["unvoiced", "voiced"]
    };

    var testGender = {
        key: "gender",
        values: ["male", "female"]
    }
    console.log(tags);
    var test = tags;

    var gui = new dat.GUI({ autoPlace: false });

    var obj = { Filter: function () { console.log("clicked") } };


    for (var i = 0; i < test.length; i++) {
        var tag = test[i];
        var phonem = gui.addFolder(tag.key);
        var o = {}
        for (var j = 0; j < tag.values.length; j++) {
            o[tag.values[j]] = true;
            phonem.add(o, tag.values[j]);
        }
    }

    gui.add(obj, 'Filter');
    var doc = document.getElementById('overlay');
    doc.appendChild(gui.domElement);
}








