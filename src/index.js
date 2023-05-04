import React from 'react';
import {useState, useCallback} from 'react';
import ReactDOM from 'react-dom/client';
import {Container, Grid} from '@mui/material';
import ThreeJsScene from './ThreeJsScene';
import {
    convertThreeJsObjects,
    setBgColor,
    setPlaying,
    setShowGroundGrid,
    setShowGround,
    setShowAxis,
    setStopPlaying,
    controlAnimationProgress,
    setRendererImage,
    setFar,
    setFOV,
    setNear,
    refreshSceneTree,
    handleSelectedObject,
    setVisible,
    handlePoseSelectedObject
} from './ThreeJsScene';
import ScenePanel from './ScenePanel'
import AnimationPanel from './AnimationPanel'
import SendToControlNetPanel from './SendToControlNetPanel'
import ModelPanel from './ModelPanel'
import PosePanel from './PosePanel'

let _sendImage;

export default function App({controlNetNum}) {
    const [sceneObjects, setSceneObjects] = useState([]);

    const [uploadedModelFile, setUploadedModelFile] = useState(null);

    const [poseModelFileName, setPoseModelFileName] = useState(null);

    const handleSceneInitialized = useCallback((scene) => {
        const objects = convertThreeJsObjects(scene);

        setSceneObjects(objects);
    }, []);

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

                        <ThreeJsScene
                            onSceneInitialized={handleSceneInitialized}
                            uploadedModelFile={uploadedModelFile}
                            poseModelFileName={poseModelFileName}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <PosePanel handlePoseSelectedObject={handlePoseSelectedObject} setPoseModelFileName={setPoseModelFileName}/>
                        <ModelPanel setUploadedModelFile={setUploadedModelFile}/>

                        <ScenePanel refreshSceneTree={refreshSceneTree} handleSelectedObject={handleSelectedObject}
                                    setVisible={setVisible}
                                    setCameraNear={setNear} setCameraFar={setFar} setCameraFOV={setFOV}
                                    setCanvasBgColor={setBgColor}/>

                        <AnimationPanel setAnimationPlaying={setPlaying} setAnimationStopPlaying={setStopPlaying}
                                        controlAnimation={controlAnimationProgress}/>

                        <SendToControlNetPanel options={options} onValueChange={handleValueChange}
                                               setRendererImage={setRendererImage}
                                               sendImage={_sendImage}/>
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

// const root = ReactDOM.createRoot(document.getElementById('sd-3d-model-loader-container'));

// root.render(<App controlNetNum={3}/>);

export function setSendImageFunc3dmodel(sendImage) {
    _sendImage = sendImage;
}

window.create3dmodelLoaderApp = create3dmodelLoaderApp;
window.setSendImageFunc3dmodel = setSendImageFunc3dmodel;


