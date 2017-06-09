// var appDir = require('app-root-path');
// var audioPlayer = require(appDir + "/app/AudioPlayer");
// var assert = require('assert');
// var Data;

// describe('AudioPlayer', function() {

// 	before(function() {
// 		Data = require(appDir + "/app/Data");
// 		var json = require(appDir + "/test/testdata.json");
// 		Data.loadData(json);
		
// 	});

// 	it('should update audiofile when requested to play it', function() {
// 		console.log(appDir + '/public/' + Data.getUrl(0));
// 		audioPlayer.play(appDir  + '/public/' + Data.getUrl(0));
// 		assert(audioPlayer.audioFile !== null);
// 	});
// });