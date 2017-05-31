var Data = require("./Data");

var updateDiv = function (uDiv, point) {
    var currdiv;
    uDiv.getElementsByClassName('filename')[0].innerHTML = point.meta[0].values;
    for (var i = 1; i < point.meta.length; i++) {
        currdiv = uDiv.getElementsByClassName(point.meta[i].key)[0];
        currdiv.innerHTML = point.meta[i].values;
    }
};

var InfoOverlay = module.exports = {
    tags: null,
    infoDiv: null,
    activeDiv: null,
    infopanelDiv: null,

    init : function (newActiveDiv, newInfoDiv, newInfoPanelDiv, newTags) {
        
        activeDiv = newActiveDiv;
        infoDiv = newInfoDiv;
        infopanelDiv = newInfoPanelDiv;
        tags = newTags;

        var outerDiv, innerDiv;
        outerDiv = document.createElement( 'div' );
        outerDiv.className = 'filename';
        
        infoDiv.appendChild(outerDiv);
        infopanelDiv.appendChild(outerDiv.cloneNode(true));


        for (var i = 1; i < tags.length; i++) {
            outerDiv = document.createElement( 'div' );
            outerDiv.innerHTML = tags[i].key + ': ';
 
            innerDiv = document.createElement( 'div' );
            innerDiv.className = tags[i].key + ' infoInstance';
            
            outerDiv.appendChild(innerDiv);
 
            infoDiv.appendChild(outerDiv);
            infopanelDiv.appendChild(outerDiv.cloneNode(true));
        }

        var a1 = document.createElement('a');
        a1.appendChild(document.createTextNode("open box"));
        a1.href = "http://example.com";

        var a2 = document.createElement('a');
        a2.appendChild(document.createTextNode("remove"));
        a2.href = "http://example.com";

        infopanelDiv.appendChild(a1);
        infopanelDiv.appendChild(a2);

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

    }

}