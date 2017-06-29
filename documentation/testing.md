The project includes unit tests and Selenium tests.

Unit tests can be run with `npm test`. 

Selenium tests are run with `npm run cucumber`.

Selenium tests do not work in TravisCI due to the fact that Travis doesn’t support webGL. Instead Selenium tests are run manually on the developer's local machine before pushing to Github.

Functionalities that require mouse movement and clicking on the canvas are not tested because Selenium can only click on absolute coordinates as the canvas does not have any distinct objects (i.e.: you can’t click on a voice sample by id for example). The team decided not to do tests that would need mouse clicking on coordinates as maintaining them would be extremely time consuming. 

Sound playback is not tested and any changes to it requires manual testing.

