'use strict';

var Data = require('./Data');
var sounds = [];
var current = null;
var playingEnabled = true;
var audioFile = null;

var playSound = function(index) {
	if (current) {
		current.stop(0);
		current = null;
	}
	var context = sounds[index].context;
	var source = context.createBufferSource();
	source.buffer = sounds[index].buffer;
	source.connect(context.destination);
	current = source;
	current.onended = clearCurrent;
	source.start(0);
	return source;
};

var playSoundFromPath = function(path) {
	if (audioFile !== null) {
		audioFile.pause();
		audioFile.startTime = 0;
	}
	audioFile = new Audio(path);
	audioFile.play().catch(function() {
		//whatever
	});
};

var clearCurrent = function() {
	current = null;
};

var iterateSounds = function(soundIndexes, index) {
	if (index >= soundIndexes.length) {
		return;
	}
	if (playingEnabled) {
		var source = playSound(soundIndexes[index]);
		source.addEventListener('ended', function() {
			iterateSounds(soundIndexes, index + 1);
		});

	} else {
		playingEnabled = true;
	}
};

var AudioPlayer = module.exports = {

	loadSounds: function(array) {
		sounds = array;
	},

	playSound: function(index) {
		if (sounds) {
			playSound(index);
		} else {
			playSoundFromPath(Data.getUrl(index));
		}
	},

    /**
     * @param {number[]} soundIndexes
     */
	playSounds: function(soundIndexes) {
		iterateSounds(soundIndexes, 0);
	},

	stop: function() {
		playingEnabled = false;
	}
};