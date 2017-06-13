'use strict';

var Data = require("./Data");
var audioPlayer = require("./AudioPlayer");

var infoDiv, activeDiv, infopanelDiv, selectedDiv, activeHref, tags;

var tagNames = [];

var createMetaHTML = function(point) {
    var html = "", key, i;

    for (i = 0; i < tagNames.length; i++) {
        key = tagNames[i];
        html += '<div>' + key + ': <span class="infoInstance ' + key + '">' + point.meta[key] + '</span></div>';
    }
    return html;
};

/**
 * Replaces html element contents with the meta info of a point
 *
 * @param targetElement
 * @param point
 */
var updateDiv = function(targetElement, point) {
    targetElement.innerHTML = createMetaHTML(point);
};

// Toistaa äänitiedoston
var playSound = function(href) {
    audioPlayer.play(href);
};

//Lataa äänitiedoston
// https://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page
var downloadSound = function(href) {
    if (href) {
        var a = document.createElement('A');
        a.href = href;
        a.download = href.substr(href.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

var onClickOnPlayLink = function() {
    playSound(activeHref);
};

var onClickOnDownloadLink = function() {
    downloadSound(activeHref);
};

var hideInfoPanels = function() {
    document.getElementById('infoPanels').style.visibility = 'hidden';
};

var onClickOnDownloadLinkAll = function() {

};

var onClickOnPlayLinkAll = function() {

};

var onCLickOnDeselectAll = function() {

};

/**
 * Creates button elements for the info panel
 * @returns {Element}
 */
var createInfoPanelButtons = function() {
    var buttons = document.createElement('div');
    buttons.className = 'buttons';

    var createButton = function(text, onclick) {
        var elem = document.createElement('a');
        elem.innerHTML = text;
        elem.addEventListener('click', function(event) {
            event.preventDefault();
            onclick();
        });
        return elem;
    };

    var download = createButton('Download', onClickOnDownloadLink);
    var play = createButton('Play', onClickOnPlayLink);
    var close = createButton('Close', hideInfoPanels);

    download.title = 'Keyboard shortcut: ' + String.fromCharCode(68); // D

    buttons.appendChild(download);
    buttons.appendChild(play);
    buttons.appendChild(close);

    return buttons;
};

var createSelectedPanelButtons = function() {
    var buttons = document.createElement('div');
    buttons.className = 'buttons';

    var createButton = function(text, onclick) {
        var elem = document.createElement('a');
        elem.innerHTML = text;
        elem.addEventListener('click', function(event) {
            event.preventDefault();
            onclick();
        });
        return elem;
    };

    var download = createButton('Download all', onClickOnDownloadLinkAll);
    var play = createButton('Play all', onClickOnPlayLinkAll);
    var deselect = createButton('Deselect all', onCLickOnDeselectAll);

    buttons.appendChild(download);
    buttons.appendChild(play);
    buttons.appendChild(deselect);

    return buttons;
};

var infoPanelMetaContainer = document.createElement('div');
var infoPanelButtons = createInfoPanelButtons();
var selectedPanelContainer = document.createElement('div');
var selectedPanelButtons = createSelectedPanelButtons();

module.exports = {

    init: function(activePointsElementId, infoElementId, infoPanelElementId, selectedElementId, newTags) {
        activeDiv = document.getElementById(activePointsElementId);
        infoDiv = document.getElementById(infoElementId);
        infopanelDiv = document.getElementById(infoPanelElementId);

        selectedDiv = document.getElementById(selectedElementId);
        selectedDiv.innerHTML = "";
        selectedDiv.appendChild(selectedPanelContainer);
        selectedDiv.appendChild(selectedPanelButtons);
        selectedDiv.style.visibility = 'hidden';

        tags = newTags;
        tagNames = Object.keys(tags);

        infopanelDiv.innerHTML = ""; // empty element if resetting
        infopanelDiv.appendChild(infoPanelMetaContainer);
        infopanelDiv.appendChild(infoPanelButtons);

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

    resetAndHideSelected: function() {
        infoPanelMetaContainer.innerHTML = "";
        selectedDiv.style.visibility = 'hidden';
    },

    updateSelected: function(selectedAmount) {
        selectedPanelContainer.innerHTML = selectedAmount + ' selected';
        selectedDiv.style.visibility = 'visible';
    },

    onClickOnPoint: function(activePoint) {
        var point = Data.getPoint(activePoint);
        activeHref = Data.getUrl(activePoint);
        updateDiv(infoPanelMetaContainer, point);
        infopanelDiv.style.visibility = 'visible';
    },

    onDownloadHotkey: function(activePoint) {
        downloadSound(activeHref);
    },

    onClickOnPlayLink: onClickOnPlayLink,

    onClickOnDownloadLink: onClickOnDownloadLink,

    onCLickOnDeselectAll: onCLickOnDeselectAll,

    onClickOnPlayLinkAll: onClickOnPlayLinkAll,

    onClickOnDownloadLinkAll: onClickOnDownloadLinkAll

};