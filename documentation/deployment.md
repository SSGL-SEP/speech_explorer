New analyzed .json files needs to be put to `public/data/` directory. Information about the .json also needs to be added to `public/config.json`. Instructions for this are in adding datasets part. Remember to push new .json files to Github if you want to see them deployed to Heroku. 

Audio files are added to `public/audio/{dataset}/` or to Amazon S3 depending on deployment method used (see instructions below). Audio blob file is also added into the same directory.

# Setting up Heroku

Heroku Free is enough to run the app. Only bad thing with the free tier is that Heroku will put the app to sleep if it is not used in 30 minutes. After that it will take 20-30 seconds for the app to start again when the next user tries to load the app.

Audio files must be hosted on Amazon S3 if you want to use Heroku to host the app. Instructions for this are below.

- Have a Github repository up for the project. You must be the owner of that repository so fork it if needed
- Sign up and login at www.heroku.com
- Click new and then create new app from Heroku dashboard (https://dashboard.heroku.com/apps)
- Give name to the app. This will be in the URL and has to be unique
- Select Europe in runtime selection
- Click create app
- In the app’s deployment tab (should be automatically redirected) find Deployment method and click connect to Github
- If you have not already connected your Github account to Heroku account you need to click -
- Connect to Github button. This opens up a new browser window where you need to login to Github. - After logging in press confirm to give Heroku access to your Github repositories
- On Connect to GitHub select Github user/organization and type in the name of the repository
- Click search and the repository should appear. - Click connect.
- Below this you can see two choices: manual deployment or automatic deployment. Choose which one you prefer. Automatic deployment will deploy every new Github push so if you are actively developing the app this might be a good choice (this includes adding new .json dataset files). -
- Make sure master branch is selected. Click deploy branch on the preferred method
- Heroku will now pull the repository, build and launch the app at {Name given in step 4}.herokuapp.com

## Setting up Amazon S3 (needed for Heroku)

- Browse to https://aws.amazon.com/s3/
- Click Get started with Amazon S3
- Create new Amazon account or use an existing one to login (needs credit card)
- Go to Amazon AWS console (https://console.aws.amazon.com/)
- Search for S3 in AWS services
- Click S3
- Click Create bucket
- Give name to the bucket and select Eu (Ireland) as region
- Click next twice
- In set permissions tab click Manage public permissions
- Set Read access to objects to Everyone
- Click next and Create bucket

## Uploading audio files to S3 with web interface 

Note that the web browser interface for uploading files is very slow and only suitable for small (less than a few thousand) files.

- Click the bucket’s name in https://console.aws.amazon.com/s3/
- Click create folder. The folder’s name must be the same as the audio dataset’s name (ie. phonemes, syllables)
- Click the newly created folder’s name to open it
- Click upload and select audio files to upload them

## Uploading audio files to S3 with command line interface

For uploading thousands of audio files you will want to use Amazon’s command line interface which will upload files much faster.

- Click the bucket’s name in https://console.aws.amazon.com/s3/
- Click create folder. The folder’s name must be the same as the audio dataset’s name (ie. phonemes, syllables)
- Follow the instructions for installing AWS CLI at https://aws.amazon.com/cli/
- Type: `aws s3 cp {local folder} s3://{bucket name}/{folder name}` to upload audio files

# Building a local version with Electron-builder

Audio files must be in `public/audio/{dataset name}/`.

Electron application is built using [electron-builder](https://github.com/electron-userland/electron-builder). Electron-builder uses settings defined in package.json. To customize build refer to [electron-builder wiki](https://github.com/electron-userland/electron-builder/wiki). Electron-builder will only create distributions for current platform. To create distributions for multiple platforms it is recommended to use build servers.

  - Type: npm run dist to locally create distributions on Linux or Mac.
  - Type: npm run dist-win to locally create distribution on Windows.

Created files are determined by "target" under "build" in package.json. Files are placed in .dist -folder.
  
# Building and releasing a local version using build servers

Github releases can be generated automatically using Travis and AppVeyor:
  - First change version in package.json to wanted version.
  - Then tag current commit: git tag "version" , for example git tag v1.0.0
  - Then push created tag to github: git push origin "tag"


# Running the app locally with Node.js

Audio files must be in `public/audio/{dataset name}/`.

This deployment method is good for rapidly checking out different datasets without much setup work. You can for example just replace an existing json data file in the public/data folder and reload the app’s web page to see what a dataset looks like. Note that if you add a completely new dataset you must also add its information to public/config.json.

- Install node.js from https://nodejs.org/en/
- Install git, clone the repository to your computer and open command line in that directory
- Type: `git submodule init`. This command is only needed to be run once.
- Type: `git submodule update`. This will use git to install the required secondary repository
- Type: `npm install` to install node dependencies
- Type: `npm build` to build the app
- Type: `npm start` to start the app on a local webserver. The app will be running at http://localhost:3000/

You can also run the command `npm run dev` instead of steps 5 and 6. This will build and launch the app. It will also monitor changes to the code and automatically rebuild if needed so you only need to refresh your browser to use new changes. This is a good choice if you are actively developing the app.

# Building and running a static local version

Audio files must be in `public/audio/{dataset name}/`.

This type of deployment is not supported and might only work with Firefox but if you only have access to a webhost without the ability to run a Node.js server this might be a decent choice to get some functionality. Some features, for example download selected set, might not work. Basic features should all work though, albeit slowly.

- Install node.js from https://nodejs.org/en/
- Install git, clone the repository to your computer and open command line in that directory
- Type: `git submodule init`. This command is only needed to be ran once.
- Type: `git submodule update`. This will use git to install the required secondary repository
- Type: `npm install` to install node dependencies
- Type: `npm build` to build the app
- Copy the public folder anywhere (including websites that can serve html files)
- Open the url where the index.html is hosted or double click index.html to launch it from your own computer.

NOTE: As said before this method is unsupported and should only be used if no other method is possible and for personal use only! The app will work slowly and depending on browser’s security features might not work at all.


