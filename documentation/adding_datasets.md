Datasets jsons are located in public/data/ directory. Information about the dataset also needs to be added in the master list in config.json which is in public directory. Config.json’s information is used in various parts of the app so config.json should be kept up to date for full functionality. See dataformats documentation for more information.

Method for adding audio files differs based on deployment method. See deployment instructions for more information.

##Adding datasets

###Manual method

- Clone the repository to your own computer
- Clone and run the t-SNE cruncher on your audio files (see cruncher’s instructions)
- Copy dataset’s .json file from cruncher’s output to public/data/
- Add dataset’s information to the master json file config.json in public/

You can also manually edit config.json if you for example want to change the ordering of the datasets or which one is shown by default.

###Automatic method

This method will add all the datasets (.json files in public/data/) automatically to config.json. The method will remove any missing datasets from config.json and add any new ones. Ordering of datasets is preserved.

- Install node.js from https://nodejs.org/en/
- Clone the repository and open command line in the repository’s directory
- Type: npm install to install node dependencies
- Type: npm run createconfig

