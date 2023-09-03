import React from 'react';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Container, Grid} from '@mui/material';
import ThreeJsScene from './ThreeJsScene';
import {
    setBgColor,
    setPlaying,
    setStopPlaying,
    controlAnimationProgress,
    setRendererImage,
    downloadRendererImage,
    setFar,
    setFOV,
    setNear,
    refreshSceneTree,
    handleSelectedObject,
    setVisible,
    handlePoseSelectedObject,
    removeObject,
    loadPoseModel,
    setPreviewSize,
    setRenderMode,
    setDepthContrast,
    showHandBones,
    setGroundColor
} from './ThreeJsScene';
import ScenePanel from './ScenePanel'
import AnimationPanel from './AnimationPanel'
import SendToControlNetPanel from './SendToControlNetPanel'
import ModelPanel from './ModelPanel'
import HandPanel from './HandPanel'
import RenderPanel from "./RenderPanel";
import PosePanel from "./PosePanel";
import SizePanel from "./SizePanel";
import LoadModelPanel from "./LoadModelPanel";

let _sendImage;

export default function App({configs}) {
    const [uploadedModelFile, setUploadedModelFile] = useState(null);

    return (
        <>
            <Container maxWidth="none">
                <Grid container spacing={3}>
                    <Grid item xs={10} style={{height: '80vh'}}>
                        <Grid container item xs={12} spacing={3}>
                            <Grid item xs={2}>
                                <ModelPanel setUploadedModelFile={setUploadedModelFile}/>
                            </Grid>
                            <Grid item xs={2}>
                                <LoadModelPanel setPoseModelFileName={loadPoseModel} modelName={"hand.fbx"}
                                                labelName={"load hand model"}/>
                            </Grid>
                            <Grid item xs={2}>
                                <LoadModelPanel setPoseModelFileName={loadPoseModel} modelName={"pose.vrm"}
                                                labelName={"load pose model"}/>
                            </Grid>
                            <Grid item xs={3}>
                                <RenderPanel setRenderMode={setRenderMode} setDepthContrast={setDepthContrast}/>
                            </Grid>
                            <Grid item xs={3}>
                                <SizePanel setPreviewSize={setPreviewSize}/>
                            </Grid>
                        </Grid>
                        <ThreeJsScene
                            configs={configs}
                            uploadedModelFile={uploadedModelFile}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <HandPanel handlePoseSelectedObject={handlePoseSelectedObject}
                                   showHandBones={showHandBones}/>

                        <PosePanel handlePoseSelectedObject={handlePoseSelectedObject}
                        />
                        <ScenePanel configs={configs} refreshSceneTree={refreshSceneTree}
                                    handleSelectedObject={handleSelectedObject}
                                    setVisible={setVisible}
                                    setCameraNear={setNear} setCameraFar={setFar} setCameraFOV={setFOV}
                                    setCanvasBgColor={setBgColor} removeObject={removeObject} setGroundColor={setGroundColor}/>
                        <SendToControlNetPanel configs={configs}
                                               setRendererImage={setRendererImage}
                                               sendImage={_sendImage} downloadRendererImage={downloadRendererImage}/>
                        <AnimationPanel setAnimationPlaying={setPlaying} setAnimationStopPlaying={setStopPlaying}
                                        controlAnimation={controlAnimationProgress}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export function create3dmodelLoaderApp({container, configs}) {
    const root = ReactDOM.createRoot(container);

    root.render(<App configs={configs}/>);
}


export function setSendImageFunc3dmodel(sendImage) {
    _sendImage = sendImage;
}

window.create3dmodelLoaderApp = create3dmodelLoaderApp;
window.setSendImageFunc3dmodel = setSendImageFunc3dmodel;

function localDev() {
    const root = ReactDOM.createRoot(document.getElementById('sd-3d-model-loader-container'));

    const configs = {
        "controlNetNum": 4,
        "defaultBGColor": "#ff0000",
        "defaultGroundColor": "#00ff00",
        "defaultShowGround": "True" === "True",
        "defaultShowGird": "True" === "True",
        "defaultShowAxis": "True" === "True"
    }

    root.render(<App configs={configs}/>);
}

// enable this method for local dev, and run npm start
// localDev();