var dat = require("dat.gui/build/dat.gui.min.js");


var gui = new dat.GUI({ autoPlace: false });
var filter = {
    a: false,
    e: false,
    voiced: false,
    unvoiced: false
};
var obj = { Filter:function(){ console.log("clicked") }};



var phonem = gui.addFolder("Phonem");
phonem.add(filter,"a");
phonem.add(filter,"e");
var voiced = gui.addFolder("Voiced");
voiced.add(filter,"voiced");
gui.add(obj,'Filter');
var doc = document.getElementById('overlay');
doc.appendChild(gui.domElement);

