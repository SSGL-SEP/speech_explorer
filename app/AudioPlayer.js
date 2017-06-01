'use strict';

var AudioPlayer = module.exports = {

	audioFile : null,

	play : function (path) {

		if (this.audioFile !== null) {
			this.audioFile.pause();
			this.audioFile.startTime = 0;
		}

		this.audioFile = new Audio(path);
		this.audioFile.play();

	}

};