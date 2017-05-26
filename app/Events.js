
var Visualizer;
var Data = require('./Data');

module.exports = {
    init: function(visualizer) {
        Visualizer = visualizer;
    },
    onBgDown: function (event) {
        var x = (event.clientX-window.innerWidth*0.5) / Visualizer.zoomer.scale.x;
        var y = (-event.clientY+window.innerHeight*0.5) / Visualizer.zoomer.scale.y;
        // console.log("onBgDown triggered");
        var anchorOffset = new THREE.Vector2( x, y );
        var draggerStart = new THREE.Vector2(Visualizer.panner.position.x,Visualizer.panner.position.y);

        var onTouchMove = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            onMove(event);
        };

        var onMove = function(event) {
            // console.log("onMove triggered");
            if(	Visualizer.touchState === Visualizer.IS_ZOOMING) {
                return;
            }

            Visualizer.panner.position.x = event.clientX-window.innerWidth*0.5;
            Visualizer.panner.position.y = -event.clientY+window.innerHeight*0.5;
            Visualizer.panner.position.x/=Visualizer.zoomer.scale.x;
            Visualizer.panner.position.y/=Visualizer.zoomer.scale.y;
            Visualizer.panner.position.x -= anchorOffset.x;
            Visualizer.panner.position.y -= anchorOffset.y;
            Visualizer.panner.position.x += draggerStart.x;
            Visualizer.panner.position.y += draggerStart.y;
            // Visualizer.updateDraggers();
            event.preventDefault();
        };

        var onTouchUp = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            onUp(event);
        };

        var onUp = function(event) {
            // console.log("onUp triggered");
            Visualizer.context.removeEventListener('mousemove', onMove, false);
            Visualizer.context.removeEventListener('mouseup', onUp, false);
            Visualizer.context.removeEventListener('mouseupoutside', onUp, false);

            Visualizer.context.removeEventListener('touchmove', onTouchMove, false);
            Visualizer.context.removeEventListener('touchend', onTouchUp, false);
            Visualizer.context.removeEventListener('touchcancel', onTouchUp, false);
            event.preventDefault();
        };

        Visualizer.context.addEventListener('mousemove', onMove, false);
        Visualizer.context.addEventListener('mouseup', onUp, false);
        Visualizer.context.addEventListener('mouseupoutside', onUp, false);

        Visualizer.context.addEventListener('touchmove', onTouchMove, false);
        Visualizer.context.addEventListener('touchend', onTouchUp, false);
        Visualizer.context.addEventListener('touchcancel', onTouchUp, false);
    },

    onWheel: function (event) {
        var delta = (!event.deltaY) ? event.detail : event.deltaY;
        // var controller = document.getElementById("controller");
        var scalarWidth = window.innerWidth/1000;
        var scalarHeight = window.innerHeight/1000;
        var resetScale = (scalarWidth<scalarHeight) ? scalarWidth : scalarHeight;

        if(Visualizer.isScrollDisabled) {
            return true;
        }

        if(delta>0) {
            Data.cloudSize2D/=1.05;
            Data.cloudSize2D = (Data.cloudSize2D<resetScale) ? resetScale : Data.cloudSize2D;
            scalar = Data.cloudSize2D;
            Visualizer.zoomer.scale.set(scalar,scalar,scalar);
            // Visualizer.updateDraggers();
        } else {
            Data.cloudSize2D*=1.05;
            Data.cloudSize2D = (Data.cloudSize2D>20) ? 20 : Data.cloudSize2D;
            scalar = Data.cloudSize2D;
            Visualizer.zoomer.scale.set(scalar,scalar,scalar);
            // Visualizer.updateDraggers();
        }
        Data.pointSize = Math.max(2, Data.cloudSize2D);
        Visualizer.update(true);
        Visualizer.needsRefresh = true;
    }
}