var Data = require("./Data");


var InfoOverlay = module.exports = {
    tags: null,
    dmElement: null,

    init : function (newDmElement, newTags) {
        dmElement = newDmElement;
        tags = newTags;
        var outerDiv, innerDiv;
        outerDiv = document.createElement( 'div' );
        outerDiv.innerHTML = '</br>';
        outerDiv.id = 'filename';
        dmElement.appendChild(outerDiv);

        for (var i = 1; i < tags.length; i++) {
            outerDiv = document.createElement( 'div' );
            dmElement.appendChild(outerDiv);
            outerDiv.innerHTML = tags[i].key + ': ';
            innerDiv = document.createElement( 'div' );
            outerDiv.appendChild(innerDiv);
            innerDiv.id = tags[i].key;
            innerDiv.className = 'infoInstance';
        }
        dmElement.style.visibility = 'hidden';

    },

    updateInfo : function (activePoint) {
        var currdiv;
        var currPoint = activePoint;
        var point = Data.getPoint(activePoint);
        document.getElementById('filename').innerHTML = point.meta[0].values;
        for (var i = 1; i < point.meta.length; i++) {
            currdiv = document.getElementById(point.meta[i].key);
            currdiv.innerHTML = point.meta[i].values;
        }
        document.getElementById('info').style.visibility = 'visible';
    },

    hideInfo : function () {
        document.getElementById('info').style.visibility = 'hidden';
    }

}