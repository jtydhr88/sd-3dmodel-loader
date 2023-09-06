# Local Dev

## Prepare
1. clone this repo.
1. run **npm install** from this repo
2. run **npm install -g http-server** from this repo

## Local Run
1. go to src/index.js, then find and enable `localDev();` (the last line)
2. go to src/ThreeJsScene.js, find and enable `let path = "http://127.0.0.1:3001/" + poseModelFileName;`
3. run `npm start`
4. run `http-server ./models -p 3001 --cors`

## Build
1. revert the previous two lines change of local dev.
2. run `webpack --mode production`
3. copy **3d-model-loader.bundle.js** from dist folder to js folder
