'use strict';

var Data = require("./Data");
var infoDiv, activeDiv, infopanelDiv, selectedDiv, activeHref, helpButtonDiv, manualDiv, backgroundDiv;
var onClicks = {};

var setAction = function(handle, func) {
    onClicks[handle] = func;
};

var runAction = function(handle) {
    if (typeof handle === 'function') {
        handle();
        return;
    }

    var func = onClicks[handle];
    if (typeof func === 'function') {
        func();
    }
};

var createMetaHTML = function(point) {
    var html = '<div>' + point.filename + '</div>', i;
    var tags = Object.keys(point.meta);

    for (i = 0; i < tags.length; i++) {
        html += '<div>' + tags[i] + ': <span class="infoInstance ' + tags[i] + '">';
        html += point.meta[tags[i]] + '</span></div>';
    }
    return html;
};

var createSimpleButton = function(text, onclick) {
    var elem = document.createElement('span');
    elem.innerHTML = text;
    elem.className = 'icon-btn button';
    elem.addEventListener('click', function(event) {
        event.preventDefault();
        onclick();
    });
    return elem;
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

var hideInfoPanels = function() {
    document.getElementById('infoPanels').style.visibility = 'hidden';
};

var showHelp = function() {
    manualDiv.classList.add('open');
    backgroundDiv.classList.add('open');
};
var hideHelp = function() {
    manualDiv.classList.remove('open');
    backgroundDiv.classList.remove('open');
};

/**
 * Creates element with buttons
 * @param {string} className
 * @param {object[]} buttons - An array of objects with button parameters (title, action)
 * @returns {Element}
 */
var createButtonContainer = function(className, buttons) {
    var container = document.createElement('div');
    container.className = className;

    var createButton = function(text, onclick) {
        var elem = document.createElement('a');
        elem.innerHTML = text;
        elem.addEventListener('click', function(event) {
            event.preventDefault();
            runAction(onclick);
        });
        return elem;
    };

    for (var i = 0; i < buttons.length; i++) {
        var button = createButton(buttons[i].title, buttons[i].action);
        container.appendChild(button);
    }

    return container;
};

var infoPanelMetaContainer;
var infoPanelButtons;
var selectedPanelContainer;
var selectedPanelButtons;

module.exports = {
    init: function(activePointsElementId, infoElementId, infoPanelElementId, selectedElementId) {
        activeDiv = document.getElementById(activePointsElementId);
        infoDiv = document.getElementById(infoElementId);
        infopanelDiv = document.getElementById(infoPanelElementId);
        helpButtonDiv = document.getElementById('help-button');

        infoPanelMetaContainer = document.createElement('div');
        infoPanelButtons = createButtonContainer('infobuttons', [
            {
                title: 'Download',
                action: 'download'
            },
            {
                title: 'Play',
                action: 'play'
            },
            {
                title: 'Deselect',
                action: 'deselect'
            },
            {
                title: 'Close',
                action: hideInfoPanels
            }
        ]);
        selectedPanelContainer = document.createElement('div');
        selectedPanelButtons = createButtonContainer('selectedbuttons', [
            {
                title: 'Download all',
                action: 'downloadAll'
            },
            {
                title: 'Play all',
                action: 'playAll'
            },
            {
                title: 'Stop',
                action: 'stop'
            },
            {
                title: 'Deselect all',
                action: 'deselectAll'
            }
        ]);

        selectedDiv = document.getElementById(selectedElementId);
        selectedDiv.innerHTML = "";
        selectedDiv.appendChild(selectedPanelContainer);
        selectedDiv.appendChild(selectedPanelButtons);
        selectedDiv.style.visibility = 'hidden';

        infopanelDiv.innerHTML = ""; // empty element if resetting
        infopanelDiv.appendChild(infoPanelMetaContainer);
        infopanelDiv.appendChild(infoPanelButtons);
        helpButtonDiv.innerHTML = "";
        helpButtonDiv.appendChild(createSimpleButton('Help', showHelp));

        manualDiv = document.getElementById('help-box');
        var closeButton = createSimpleButton('Close', hideHelp);
        closeButton.classList.add('close-help-button');
        manualDiv.insertBefore(closeButton, manualDiv.firstChild);
        backgroundDiv = document.getElementById('background');
        backgroundDiv.addEventListener('click', hideHelp);

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
        selectedPanelContainer.innerHTML = "";
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

    setAction: setAction
};