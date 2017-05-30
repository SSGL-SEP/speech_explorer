var Data = require("./Data");


var InfoOverlay = module.exports = {
    tags: null,
    info: null,
    active: null,

    init : function (newActiveElement, newinfo, newTags) {
        active = newActiveElement;
        info = newinfo;
        tags = newTags;
        var outerDiv, innerDiv;
        outerDiv = document.createElement( 'div' );
        outerDiv.innerHTML = '</br>';
        outerDiv.id = 'filename';
        info.appendChild(outerDiv);

        for (var i = 1; i < tags.length; i++) {
            outerDiv = document.createElement( 'div' );
            info.appendChild(outerDiv);
            outerDiv.innerHTML = tags[i].key + ': ';
            innerDiv = document.createElement( 'div' );
            outerDiv.appendChild(innerDiv);
            innerDiv.id = tags[i].key;
            innerDiv.className = 'infoInstance';
        }
        info.style.visibility = 'hidden';
        active.style.visibility = 'visible';

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
        info.style.visibility = 'visible';
    },

    hideInfo : function () {
        info.style.visibility = 'hidden';
    },

    updateActive : function (totalPoints, activePoints) {
        active.innerHTML =  activePoints + '/' + totalPoints + ' active';
    }

}