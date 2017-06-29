The visualization is written in Javascript mainly using three.js library. When a user loads the app a node.js server serves index.html page and bundled javascript. 

Entry.js, using ConfigDAO.js, starts the loading process of concatenated audio files for fast playback and also starts loading the visualization data.

All elements are created and then populated after the data loading is complete.

Visualizer.js serves as a center point to most other functionality. Visualizer.js creates a webGL scene, adds an orthographical camera and functionality for moving the scene around.

Data.js parses .json file of the currently active dataset and serves as an interface to the parsed data.

Events.js has event listeners which react to user input. These include zooming, panning and clicking buttons.

PointCloud.js handles the creation and updating of the actual points on screen, size and color changes are done using shaders to make them as fast as possible.

Filter.js activates and deactivate points based on the filter status passed on by FilterOverlay.js. It also has functionality for the selection of the points.

FilterOverlay.js handles the overlay on the left side of the screen. The overlay uses dat.gui which we have [forked](https://github.com/SSGL-SEP/dat.gui) to add our own functionality to it.

InfoOverlay.js creates all other overlays: mouse over, clicked on point info and selection information. These are all html div elements drawn on top of the webGL scene.

SelectionCursor.js handles the selection and removing mode indicators.

AudioPlayer.js plays sounds and interrupts already playing sound if new one is started.

Loader.js loads and processes the concatenated .mp3 file.

