import React from 'react';
import {useState, useCallback} from 'react';
import ReactDOM from 'react-dom/client';
import {Container, Grid} from '@mui/material';
import ThreeJsScene from './ThreeJsScene';
import {
    convertThreeJsObjects,
    setBgColor,
    setPlaying,
    setStopPlaying,
    controlAnimationProgress,
    setRendererImage,
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
    setDepthContrast
} from './ThreeJsScene';
import ScenePanel from './ScenePanel'
import AnimationPanel from './AnimationPanel'
import SendToControlNetPanel from './SendToControlNetPanel'
import ModelPanel from './ModelPanel'
import HandPanel from './HandPanel'
import RenderPanel from "./RenderPanel";
import PosePanel from "./PosePanel";
import SizePanel from "./SizePanel";

let _sendImage;

export default function App({controlNetNum}) {
    const [uploadedModelFile, setUploadedModelFile] = useState(null);

    const generateControlNetOptions = () => {
        const options = [];
        for (let i = 0; i < controlNetNum; i++) {
            const option = {value: i.toString(), label: i.toString()};

            options.push(option);
        }

        return options;
    }

    const options = generateControlNetOptions();

    const handleValueChange = (value) => {
        console.log('Selected value:', value);
    };

    return (
        <>
            <Container maxWidth="none">
                <Grid container spacing={3}>
                    <Grid item xs={10} style={{height: '80vh'}}>
                        <Grid container item xs={12} spacing={3}>
                            <Grid item xs={4}>
                                <ModelPanel setUploadedModelFile={setUploadedModelFile}/>
                            </Grid>
                            <Grid item xs={4}>
                                <RenderPanel setRenderMode={setRenderMode} setDepthContrast={setDepthContrast}/>
                            </Grid>
                            <Grid item xs={4}>
                                <SizePanel setPreviewSize={setPreviewSize}/>
                            </Grid>
                        </Grid>
                        <ThreeJsScene
                            uploadedModelFile={uploadedModelFile}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        {/*
                        <HandPanel handlePoseSelectedObject={handlePoseSelectedObject} setPoseModelFileName={loadPoseModel}/>
                        */}
                        <PosePanel handlePoseSelectedObject={handlePoseSelectedObject}
                                   setPoseModelFileName={loadPoseModel}/>
                        <ScenePanel refreshSceneTree={refreshSceneTree} handleSelectedObject={handleSelectedObject}
                                    setVisible={setVisible}
                                    setCameraNear={setNear} setCameraFar={setFar} setCameraFOV={setFOV}
                                    setCanvasBgColor={setBgColor} removeObject={removeObject}/>
                        <SendToControlNetPanel options={options} onValueChange={handleValueChange}
                                               setRendererImage={setRendererImage}
                                               sendImage={_sendImage}/>
                        <AnimationPanel setAnimationPlaying={setPlaying} setAnimationStopPlaying={setStopPlaying}
                                        controlAnimation={controlAnimationProgress}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export function create3dmodelLoaderApp({container, controlNetNum}) {
    const root = ReactDOM.createRoot(container);

    root.render(<App controlNetNum={controlNetNum}/>);
}

function localDev() {
    const root = ReactDOM.createRoot(document.getElementById('sd-3d-model-loader-container'));

    root.render(<App controlNetNum={3}/>);
}

export function setSendImageFunc3dmodel(sendImage) {
    _sendImage = sendImage;
}

window.create3dmodelLoaderApp = create3dmodelLoaderApp;
window.setSendImageFunc3dmodel = setSendImageFunc3dmodel;

// enable this method for local dev, and run npm start
// localDev();