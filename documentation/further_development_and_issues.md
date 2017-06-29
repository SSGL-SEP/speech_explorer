## Changing visualization to 3d
Visualizer is currently a webgl scene with an orthographic camera pointing towards negative z-axis from 0x,0y,100z position. Points in visualization are three.js point objects which normally stay the same size no matter how close they are to the camera. However as the scene is zoomed in point sizes are changed slightly larger to simulate going closer and making the points easier to hit.

(Visualization.js : createEnvironment) Camera need to be changed to perspective camera for the scene to render properly in a 3d environment.
Current point size changing probably needs to be removed.

Control scheme for 3d movement needs to be implemented. Either the camera is fixed and the scene is moved or camera moves and scene stays still.

Navigation in 3d is problematic especially without a mouse. Maybe ‘wasd’ could be used for left, right, forward, back movement and mouse/touchpad for panning/tilting when left mouse button is held down. 

(Visualization.js : draw) Currently a point which is mouse overed has its z position moved slightly towards the camera to prevent other points from showing through the enlarged point. This needs to be removed as it’s useless in 3d. 

(Visualization.js : getIntersectingPoints) Raycasting from mouse cursor is used to check which points are currently being mouse overed. Raycasting returns a list which is sorted by distance to the ray from a perpendicular angle. This code needs to be removed and default sorting method can be used (distance to the camera).

## A more robust loading indicator
Ajax loading is indicated to the user using Pace (http://github.hubspot.com/pace/), which automatically follows all ajax calls. Unfortunately it does not differentiate the components that are being downloaded, so the percentage does not accurately reflect the amount still to be loaded. This is evident when the concatenated_audio.blob is large which leads to pace being seemingly stuck on 99% for a long time.

## A better control panel for filtering

The filtering UI is generated using dat.gui (https://github.com/dataarts/dat.gui). In order to get the panel to work as expected, we have had to modify dat.gui’s code and we inject elements to it on runtime, which is suboptimal. A custom filtering control would probably be more lightweight and there would be more control over its appearance.

# Known issues:

- Bug: if mouse is held over a single point while zooming in or out, that point will keep decreasing or increasing in size until mouse is moved off from it.

- Bug: loading icon (pace) sometimes stays visible even after the resources are done loading. This behavior has been noted when using Firefox. Reloading the page using Ctrl+F5 usually corrects the situation.

- Electron app bug: Raycaster breaks occasionally on startup. Starting app over can fix the issue.

- Electron app bug: Presets don't work. Electron doesn't and won't support prompts (or any blocking popup boxes). This issue can be fixed by replacing popup box calls in dat.gui with non-blocking popup boxes using a npm package that implements these.
