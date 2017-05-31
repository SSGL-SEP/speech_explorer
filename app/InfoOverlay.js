'use strict';

var Data = require("./Data");


var InfoOverlay = module.exports = {
    tags: null,
    info: null,
    active: null,

    init : function (newActiveElement, newinfo, newTags) {
        this.active = newActiveElement;
        this.info = newinfo;
        this.tags = newTags;
        var outerDiv, innerDiv;
        outerDiv = document.createElement( 'div' );
        outerDiv.innerHTML = '</br>';
        outerDiv.id = 'filename';
        this.info.appendChild(outerDiv);

        for (var i = 1; i < this.tags.length; i++) {
            outerDiv = document.createElement( 'div' );
            this.info.appendChild(outerDiv);
            outerDiv.innerHTML = this.tags[i].key + ': ';
            innerDiv = document.createElement( 'div' );
            outerDiv.appendChild(innerDiv);
            innerDiv.id = this.tags[i].key;
            innerDiv.className = 'infoInstance';
        }
        this.info.style.visibility = 'hidden';
        this.active.style.visibility = 'visible';

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
        this.info.style.visibility = 'visible';
    },

    hideInfo : function () {
        this.info.style.visibility = 'hidden';
    },

    updateActive : function (totalPoints, activePoints) {
        this.active.innerHTML =  activePoints + '/' + totalPoints + ' active';
    }

};