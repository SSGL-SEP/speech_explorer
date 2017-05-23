var dat = require("dat.gui/build/dat.gui.min.js");






var Overlay = module.exports = function (tags) {
    var gui = new dat.GUI({ autoPlace: false });

    var obj = { Filter: function () { console.log("clicked") } };


    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
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








