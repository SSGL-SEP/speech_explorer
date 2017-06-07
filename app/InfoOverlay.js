'use strict';

var Data = require("./Data");
var audioPlayer = require("./AudioPlayer");

var infoDiv, activeDiv, infopanelDiv, tags;

var updateDiv = function(uDiv, point) {
    var currdiv;
    uDiv.getElementsByClassName('filename')[0].innerHTML = point['filename'];
    for (var key in tags) {
        currdiv = uDiv.getElementsByClassName(key)[0];
        currdiv.innerHTML = point.meta[key];
    }
};

// var cloneCount = 0;

var cloneForPanel = function(model) {
    var newDiv = document.createElement('div');
    var children = model.childNodes;
    for (var i = 0; i < children.length; i++) {
        newDiv.appendChild(children[i].cloneNode(true));
    }

    var a1 = document.createElement('a');
    a1.appendChild(document.createTextNode("Download"));
    a1.id = "downloadlink1";

    var a2 = document.createElement('a');
    a2.appendChild(document.createTextNode("Close"));
    a2.href = "#";
    a2.onclick = function() {
        document.getElementById('infoPanels').style.visibility = 'hidden';
    };

    var a3 = document.createElement('a');
    a3.appendChild(document.createTextNode("Play"));
    a3.href = "#";
    a3.onclick = function() {
        var siblings = this.parentNode.children;
        for (var i = siblings.length; i--;) {
            if (siblings[i].id) {  // Tää on vaarallinen mutta voi toimia niin kauan kun muilla linkeillä ei id:tä!!
                audioPlayer.play(siblings[i].href);
                break;
            }
        }
    };

    newDiv.appendChild(a1);
    newDiv.appendChild(a3);
    newDiv.appendChild(a2);

    return newDiv;

};

var InfoOverlay = module.exports = {

    init: function(newActiveDiv, newInfoDiv, newInfoPanelDiv, newTags) {

        activeDiv = newActiveDiv;
        infoDiv = newInfoDiv;
        infopanelDiv = newInfoPanelDiv;
        tags = newTags;

        var outerDiv, innerDiv;
        outerDiv = document.createElement('div');
        outerDiv.className = 'filename';
        infoDiv.appendChild(outerDiv);


        for (var key in tags) {
            outerDiv = document.createElement('div');
            outerDiv.innerHTML = key + ': ';

            innerDiv = document.createElement('div');
            innerDiv.className = key + ' infoInstance';

            outerDiv.appendChild(innerDiv);
            infoDiv.appendChild(outerDiv);
        }

        infopanelDiv.appendChild(cloneForPanel(infoDiv));

        infoDiv.style.visibility = 'hidden';
        activeDiv.style.visibility = 'visible';
        infopanelDiv.style.visibility = 'hidden';
    },

    updateInfo: function(activePoint) {
        var point = Data.getPoint(activePoint);
        updateDiv(infoDiv, point);
        infoDiv.style.visibility = 'visible';
    },

    hideInfo: function() {
        infoDiv.style.visibility = 'hidden';
    },

    updateActive: function(totalPoints, activePoints) {
        activeDiv.innerHTML = activePoints + '/' + totalPoints + ' active';
    },

    onClickOnPoint: function(activePoint) {
        var point = Data.getPoint(activePoint);
        updateDiv(infopanelDiv, point);
        infopanelDiv.style.visibility = 'visible';
        var dlLinkDiv = document.getElementById('downloadlink1');
        dlLinkDiv.download = Data.getUrl(activePoint);
        dlLinkDiv.href = Data.getUrl(activePoint);
    }
};