var BoilerPlate = module.exports = function() {
    this._events = {};
    this.name = "BoilerPlate";
};

BoilerPlate.prototype = {
    constructor: BoilerPlate,

    traceFunction: function() {
        var args = Array.prototype.slice.call(arguments);
        var func = args.shift();
        console.log(this.name + "." + func + "(" + args + ");");
    },

    removeEventListener: function(eventName, callback) {
        var events = this._events;
        var callbacks = events[eventName] = events[eventName] || [];
        callbacks.pop(callback);
        return this;
    },

    addEventListener: function(eventName, callback) {
        var events = this._events;
        var callbacks = events[eventName] = events[eventName] || [];
        callbacks.push(callback);
        return this;
    },

    dispatchEvent: function(eventName, args) {
        var callbacks = this._events[eventName];
        if (!callbacks) {
            console.log("Event " +eventName+ " not responding.");
            return this;
        }
        for (var i = 0, l = callbacks.length; i < l; i++) {
            callbacks[i].apply(null, args);
        }
        return this;
    }

};
