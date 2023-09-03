# Local Dev

## Prepare
1. npm install
2. npm install npm install -g http-server

## Local Run
1. enable index.js -> localDev(); (the last line)
2. enable ThreeJsScene.js -> **let path = "http://127.0.0.1:3001/" + poseModelFileName;**
3. npm start
4. http-server ./models -p 3001 --cors

## Build
1. webpack --mode production
2. copy 3d-model-loader.bundle.js from dist folder to js folder
