var dat = require("dat.gui/build/dat.gui.min.js");
var boolTags = [];

var Overlay = module.exports = function (tags) {
    var gui = new dat.GUI({ autoPlace: false });

    var obj = { Filter: function () { console.log("clicked") } };

    //1 koska filenamet nollassa
    for (var i = 1; i < tags.length; i++) {
        var tag = tags[i];
        var phonem = gui.addFolder(tag.key);
        var o = {};
        for (var j = 0; j < tag.values.length; j++) {
            o[tag.values[j].value] = true;
            phonem.add(o, tag.values[j].value);
        }
    }

    gui.add(obj, 'Filter');
    var doc = document.getElementById('overlay');
    doc.appendChild(gui.domElement);
};








