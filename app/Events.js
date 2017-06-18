'use strict';

var THREE = require('three');
var Data = require('./Data');

module.exports = function(viz) {
    var visualizer = viz;
    var Events = this;

    this.onBgDown = function(event) {
        var x = (event.clientX - window.innerWidth * 0.5) / visualizer.zoomer.scale.x;
        var y = (-event.clientY + window.innerHeight * 0.5) / visualizer.zoomer.scale.y;
        var anchorOffset = new THREE.Vector2(x, y);
        var draggerStart = new THREE.Vector2(visualizer.panner.position.x, visualizer.panner.position.y);

        var onTouchMove = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            onMove(event);
        };

        var onMove = function(event) {
            if (visualizer.touchState === visualizer.IS_ZOOMING) {
                return;
            }
            visualizer.panner.position.x = event.clientX - window.innerWidth * 0.5;
            visualizer.panner.position.y = -event.clientY + window.innerHeight * 0.5;
            visualizer.panner.position.x /= visualizer.zoomer.scale.x;
            visualizer.panner.position.y /= visualizer.zoomer.scale.y;
            visualizer.panner.position.x -= anchorOffset.x;
            visualizer.panner.position.y -= anchorOffset.y;
            visualizer.panner.position.x += draggerStart.x;
            visualizer.panner.position.y += draggerStart.y;
            event.preventDefault();
        };

        // var onTouchUp = function(event) {
        //     event.clientX = event.changedTouches[0].clientX;
        //     event.clientY = event.changedTouches[0].clientY;
        //     onUp(event);
        // };

        var onUp = function(event) {
            visualizer.context.removeEventListener('mousemove', onMove, false);
            visualizer.context.removeEventListener('mouseup', onUp, false);
            visualizer.context.removeEventListener('mouseupoutside', onUp, false);

            visualizer.context.removeEventListener('touchmove', onTouchMove, false);
            visualizer.context.removeEventListener('touchend', onUp, false);
            visualizer.context.removeEventListener('touchcancel', onUp, false);
            event.preventDefault();
        };

        visualizer.context.addEventListener('mousemove', onMove, false);
        visualizer.context.addEventListener('mouseup', onUp, false);
        visualizer.context.addEventListener('mouseupoutside', onUp, false);

        visualizer.context.addEventListener('touchmove', onTouchMove, false);
        visualizer.context.addEventListener('touchend', onUp, false);
        visualizer.context.addEventListener('touchcancel', onUp, false);
    };

    this.createDraggers = function() {
        var onDragStarted = function(event) {
            Events.onBgDown(event);
        };


        var onPinchStarted = function(event) {
            var startScale = visualizer.zoomer.scale.x;

            var dx = event.touches[0].clientX - event.touches[1].clientX;
            var dy = event.touches[0].clientY - event.touches[1].clientY;
            var touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

            var onPinchMoved = function(event) {

                var dx = event.touches[0].clientX - event.touches[1].clientX;
                var dy = event.touches[0].clientY - event.touches[1].clientY;
                var touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
                var size = startScale + (touchZoomDistanceEnd - touchZoomDistanceStart) * 0.025;

                var scalarWidth = window.innerWidth / 1000;
                var scalarHeight = window.innerHeight / 1000;
                var resetScale = (scalarWidth < scalarHeight) ? scalarWidth : scalarHeight;

                size = (size > 6) ? 6 : size;
                size = (size < resetScale) ? resetScale : size;

                visualizer.zoomer.scale.set(size, size, size);
                event.stopPropagation();
                event.preventDefault();
            };

            var onPinchEnded = function(event) {
                visualizer.context.removeEventListener('touchmove', onPinchMoved, false);
                visualizer.context.removeEventListener('touchend', onPinchEnded, false);
                visualizer.context.addEventListener('touchstart', onTouchStarted, false);
            };

            visualizer.context.addEventListener('touchmove', onPinchMoved, false);
            visualizer.context.addEventListener('touchend', onPinchEnded, false);

        };

        visualizer.context.addEventListener('mousedown', onDragStarted, false);

        var onTouchStarted = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            // HACK - Need a better solution instead of using state changes;
            // SEE - visualizer.onBgDown() onMove()
            switch (event.touches.length) {
                case 1:
                visualizer.touchState = visualizer.IS_DRAGGING;
                onDragStarted(event);
                break;
                case 2:
                visualizer.touchState = visualizer.IS_ZOOMING;
                visualizer.context.removeEventListener('mousedown', onDragStarted, false);
                visualizer.context.removeEventListener('touchstart', onTouchStarted, false);
                onPinchStarted(event);
                break;

                default:
            }
        };

        visualizer.context.addEventListener('touchstart', onTouchStarted, false);
    };

    this.onWheel = function(event) {
        var delta = (!event.deltaY) ? event.detail : event.deltaY;

        var scalarWidth = window.innerWidth / 1000;
        var scalarHeight = window.innerHeight / 1000;
        var resetScale = (scalarWidth < scalarHeight) ? scalarWidth : scalarHeight;
        var scalar = null;

        if (delta > 0) {
            visualizer.cloudSize2D /= 1.05;
            visualizer.cloudSize2D = (visualizer.cloudSize2D < resetScale) ? resetScale : visualizer.cloudSize2D;
            scalar = visualizer.cloudSize2D;
            visualizer.zoomer.scale.set(scalar, scalar, scalar);
        } else {
            visualizer.cloudSize2D *= 1.05;
            visualizer.cloudSize2D = (visualizer.cloudSize2D > 20) ? 20 : visualizer.cloudSize2D;
            scalar = visualizer.cloudSize2D;
            visualizer.zoomer.scale.set(scalar, scalar, scalar);
        }
        visualizer.update(true);
    };

    /**
     * Creates listener for opening the info box. Opens the meta info box if a simple mouse click occurs.
     *
     * @param {Object} InfoOverlay - The object containing info overlay logic
     */
     this.createInfoBoxListener = function(InfoOverlay) {
        var openInfoBox = function() {
            if (visualizer.activePoint !== null) {
                InfoOverlay.onClickOnPoint(visualizer.activePoint);
                visualizer.lastClickedPoint = visualizer.activePoint;
            }
            window.removeEventListener('mouseup', openInfoBox);
        };

        // What follows is a curious dance to determine if someone merely clicked the mouse or dared to drag it.

        var setUpInfoBoxListener = function() {
            visualizer.context.addEventListener('mousedown', setUpMouseListener);
            window.removeEventListener('mouseup', setUpInfoBoxListener);
        };

        var cancelInfoBox = function() {
            window.removeEventListener('mouseup', openInfoBox);
            window.addEventListener('mouseup', setUpInfoBoxListener);
        };

        var setUpMouseListener = function() {
            window.addEventListener('mouseup', openInfoBox);
            window.addEventListener('mousemove', cancelInfoBox);
        };

        setUpInfoBoxListener();
    };

    this.resize = function() {
        clearTimeout(visualizer.resizeTimer);
        visualizer.resizeTimer = setTimeout(function() {
            visualizer.camera.left = window.innerWidth / -2;
            visualizer.camera.right = window.innerWidth / 2;
            visualizer.camera.top = window.innerHeight / 2;
            visualizer.camera.bottom = window.innerHeight / -2;
            visualizer.camera.updateProjectionMatrix();
            visualizer.renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250);

    };

    this.downloadSound = function(point) {
        var href = Data.getUrl(point);
        if (href) {
            var a = document.createElement('A');
            a.href = href;
            a.download = href.substr(href.lastIndexOf('/') + 1);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

    };

    this.downloadSounds = function(selected) {
        var max = 100;
        if (selected.length >= max) { 
            var report = 'Maximun amount of files to be downloaded at once is set at ' + max + '.';
            alert (report);
            return;
        }
        // urls of sounds
        var urlArray = [];

        // metadata of sounds
        var metaDataString = '';
        var tagNames = Object.keys(Data.getTags());

        // column names of metadata -table
        var i;
        for (i = 0; i < tagNames.length - 1; i++) {
            metaDataString += tagNames[i] + ',';
        }
        metaDataString += tagNames[i] + "\n";

        var j, point, metaDataRow;

        for (i = 0; i < selected.length; i++) {           
            point = Data.getPoint(selected[i]);
            metaDataRow = '';

            // metadatarow fo sound
            for (j = 0; j < tagNames.length - 1; j++) {
                metaDataRow += point.meta[tagNames[j]] + ',';
            }
            metaDataRow += point.meta[tagNames[j]] + "\n";
            metaDataString += metaDataRow;
            
            // url of sound
            urlArray.push(Data.getUrl(selected[i]).slice(6));
        }
        console.log(urlArray);
        console.log(metaDataString);
        var http = new XMLHttpRequest();
        var url = "/download";
        var params = "urls="+JSON.stringify(urlArray);
       // params.urls = JSON.stringify(urlArray);
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
            }
        };
        http.send(params);

    };
};