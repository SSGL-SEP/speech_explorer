'use strict';

var Data = require("./Data");
var audioPlayer = require("./AudioPlayer");

var infoDiv, activeDiv, infopanelDiv, activeHref;

// Päivittää parametrinä saadun paneelin/näytön parametrinä saadun pisteen tiedoilla
var updateDiv = function(uDiv, point) {
    var currdiv;
    //console.log(point.meta);
    uDiv.getElementsByClassName('filename')[0].innerHTML = point.meta[0].values;
    for (var i = 1; i < point.meta.length; i++) {
        currdiv = uDiv.getElementsByClassName(point.meta[i].key)[0];
        currdiv.innerHTML = point.meta[i].values;
    }
};

// Toistaa äänitiedoston
var playSound = function (href) {
    audioPlayer.play(href);
};

//Lataa äänitiedoston 
// https://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page
var downloadSound = function (href) {
    if (href) {
        var a = document.createElement('A');
        a.href = href;
        a.download = href.substr(href.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }    
};

// var cloneCount = 0;

// Kloonaa hetkellisen infonäytön pysyvämmäksi infopaneeliksi
var cloneForPanel = function(model) {
    var newDiv = document.createElement('div');
    var children = model.childNodes;
    for (var i = 0; i < children.length; i++) {
        newDiv.appendChild(children[i].cloneNode(true));
    }

    // infopaneelissa kloonatun tiedon lisäksi linkkejä
    var a1 = document.createElement('a');
    a1.appendChild(document.createTextNode("Download"));
    a1.href="#";
    a1.onclick = function () {
        InfoOverlay.onClickOnDownloadLink();
    };

    var a2 = document.createElement('a');
    a2.appendChild(document.createTextNode("Play"));
    a2.href = "#";
    a2.onclick = function() {      
        InfoOverlay.onClickOnPlayLink(); 
    };

    var a3 = document.createElement('a');
    a3.appendChild(document.createTextNode("Close"));
    a3.href = "#";
    a3.onclick = function() {
        document.getElementById('infoPanels').style.visibility = 'hidden';
    };

    newDiv.appendChild(a1);
    newDiv.appendChild(a2);
    newDiv.appendChild(a3);

    return newDiv;

};

// Varsinainen "luokka"
var InfoOverlay = module.exports = {

    tags: null,

    init: function(newActiveDiv, newInfoDiv, newInfoPanelDiv, newTags) {
        if(activeDiv){
            activeDiv.innerHTML = '';
        }
        activeDiv = newActiveDiv;
        
        if(infoDiv){
            infoDiv.innerHTML = '';
        }
        infoDiv = newInfoDiv;
        
        if(infopanelDiv){
             infopanelDiv.innerHTML = '';
        }
        infopanelDiv = newInfoPanelDiv;
    
        this.tags = newTags;

        var outerDiv, innerDiv;
        outerDiv = document.createElement('div');
        outerDiv.className = 'filename';
        infoDiv.appendChild(outerDiv);


        for (var i = 1; i < this.tags.length; i++) {
            outerDiv = document.createElement('div');
            outerDiv.innerHTML = this.tags[i].key + ': ';

            innerDiv = document.createElement('div');
            innerDiv.className = this.tags[i].key + ' infoInstance';

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
        activeHref = Data.getUrl(activePoint);
        updateDiv(infopanelDiv, point);
        infopanelDiv.style.visibility = 'visible';
    },

    onDownloadHotkey: function(activePoint) {
        downloadSound(activeHref);
    },

    onClickOnPlayLink: function () {
        playSound(activeHref);

    },

    onClickOnDownloadLink: function () {
        downloadSound(activeHref);

    }
};