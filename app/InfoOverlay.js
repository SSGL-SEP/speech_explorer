var Data = require("./Data");

var infoDiv, activeDiv, infopanelDiv;

var updateDiv = function (uDiv, point) {
    var currdiv;
    uDiv.getElementsByClassName('filename')[0].innerHTML = point.meta[0].values;
    for (var i = 1; i < point.meta.length; i++) {
        currdiv = uDiv.getElementsByClassName(point.meta[i].key)[0];
        currdiv.innerHTML = point.meta[i].values;
    }
};

// var cloneCount = 0;

var cloneForPanel = function (model) {
    var newDiv = document.createElement( 'div' );
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
    a2.onclick = function () {document.getElementById('infoPanels').style.visibility = 'hidden'};

    var a3 = document.createElement('a');
    a3.appendChild(document.createTextNode("Play"));
    a3.href = "#";
    a3.onclick = function () {console.log('Playing!')};


    newDiv.appendChild(a1);
    newDiv.appendChild(a3);
    newDiv.appendChild(a2);

    return newDiv;

};

var InfoOverlay = module.exports = {
    tags: null,

    init : function (newActiveDiv, newInfoDiv, newInfoPanelDiv, newTags) {
        
        activeDiv = newActiveDiv;
        infoDiv = newInfoDiv;
        infopanelDiv = newInfoPanelDiv;
        tags = newTags;

        var outerDiv, innerDiv;
        outerDiv = document.createElement( 'div' );
        outerDiv.className = 'filename';        
        infoDiv.appendChild(outerDiv);

        for (var i = 1; i < tags.length; i++) {
            outerDiv = document.createElement( 'div' );
            outerDiv.innerHTML = tags[i].key + ': ';
 
            innerDiv = document.createElement( 'div' );
            innerDiv.className = tags[i].key + ' infoInstance';
            
            outerDiv.appendChild(innerDiv);
            infoDiv.appendChild(outerDiv);
        }

        infopanelDiv.appendChild(cloneForPanel(infoDiv));

        infoDiv.style.visibility = 'hidden';
        activeDiv.style.visibility = 'visible';
        infopanelDiv.style.visibility = 'hidden';

    },

    updateInfo : function (activePoint) {
        var point = Data.getPoint(activePoint);
        updateDiv(infoDiv, point);
        infoDiv.style.visibility = 'visible';
    },

    hideInfo : function () {
        infoDiv.style.visibility = 'hidden';
    },

    updateActive : function (totalPoints, activePoints) {
        activeDiv.innerHTML =  activePoints + '/' + totalPoints + ' active';
    },

    onClickOnPoint : function (activePoint) {
        var point = Data.getPoint(activePoint);
        updateDiv(infopanelDiv, point);
        infopanelDiv.style.visibility = 'visible';
        var dlLinkDiv = document.getElementById('downloadlink1');
        dlLinkDiv.download = point.meta[0].values;  
        dlLinkDiv.href = Data.getUrl(activePoint);  

    }

}