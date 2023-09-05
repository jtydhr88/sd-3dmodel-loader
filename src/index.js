import React from 'react';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Container, Grid} from '@mui/material';
import ThreeJsScene from './ThreeJsScene';
import {
    setBgColor,
    controlAnimationProgress,
    setRendererImage,
    downloadRendererImage,
    sendRendererImageToCanvasEditor,
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
    setGroundColor,
    setOperateMode,
    setPlaying,
    setStopPlaying,
    showBodyBones,
    exportBonesJSON,
    importBonesJSON
} from './ThreeJsScene';
import {setCameraNear, setCameraFOV, setCameraFar} from './ThreeJSScene/Camera'

import ScenePanel from './ScenePanel'
import AnimationPanel from './AnimationPanel'
import SendToControlNetPanel from './SendToControlNetPanel'
import ModelPanel from './ModelPanel'
import HandPanel from './HandPanel'
import RenderPanel from "./RenderPanel";
import PosePanel from "./PosePanel";
import SizePanel from "./SizePanel";
import OperatePanel from "./OperatePanel";
import LoadModelPanel from "./LoadModelPanel";

let _sendImage;

export default function App({configs}) {
    const [uploadedModelFile, setUploadedModelFile] = useState(null);

    return (<>
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
                            <LoadModelPanel setPoseModelFileName={loadPoseModel} modelName={"pose.fbx"}
                                            labelName={"load pose model"}/>
                        </Grid>
                        <Grid item xs={2}>
                            <RenderPanel setRenderMode={setRenderMode} setDepthContrast={setDepthContrast}/>
                        </Grid>
                        <Grid item xs={2}>
                            <OperatePanel setOperateMode={setOperateMode}/>
                        </Grid>
                        <Grid item xs={2}>
                            <SizePanel setPreviewSize={setPreviewSize}/>
                        </Grid>
                    </Grid>
                    <ThreeJsScene
                        configs={configs}
                        uploadedModelFile={uploadedModelFile}
                    />
                </Grid>
                <Grid item xs={2}>
                    <HandPanel showHandBones={showHandBones} exportBonesJSON={exportBonesJSON}
                               importBonesJSON={importBonesJSON}/>

                    <PosePanel showBodyBones={showBodyBones} exportBonesJSON={exportBonesJSON}
                               importBonesJSON={importBonesJSON}/>

                    <ScenePanel configs={configs} refreshSceneTree={refreshSceneTree}
                                handleSelectedObject={handleSelectedObject}
                                setVisible={setVisible}
                                setCameraNear={setCameraNear} setCameraFar={setCameraFar}
                                setCameraFOV={setCameraFOV}
                                setCanvasBgColor={setBgColor} removeObject={removeObject}
                                setGroundColor={setGroundColor}/>
                    <SendToControlNetPanel configs={configs}
                                           setRendererImage={setRendererImage}
                                           sendImage={_sendImage} downloadRendererImage={downloadRendererImage}
                                           sendRendererImageToCanvasEditor={sendRendererImageToCanvasEditor}/>
                    <AnimationPanel setAnimationPlaying={setPlaying} setAnimationStopPlaying={setStopPlaying}
                                    controlAnimation={controlAnimationProgress}/>
                </Grid>
            </Grid>
        </Container>
    </>);
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
        "defaultBGColor": "#000000",
        "defaultGroundColor": "#ffffff",
        "defaultShowGround": "False" === "True",
        "defaultShowGird": "False" === "True",
        "defaultShowAxis": "False" === "True"
    }

    root.render(<App configs={configs}/>);
}

// enable this method for local dev, and run npm start
// localDev();