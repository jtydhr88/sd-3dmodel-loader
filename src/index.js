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
    setNear
} from './ThreeJsScene';
import CanvasSettingsPanel from './CanvasSettingsPanel'
import AnimationPanel from './AnimationPanel'
import SendToControlNetPanel from './SendToControlNetPanel'
import ModelPanel from './ModelPanel'
import CameraPanel from './CameraPanel'

let _sendImage;

export default function App({controlNetNum}) {
    const [sceneObjects, setSceneObjects] = useState([]);

    const [selectedObject, setSelectedObject] = useState(null);

    const [uploadedModelFile, setUploadedModelFile] = useState(null);

    const handleSceneInitialized = useCallback((scene) => {
        const objects = convertThreeJsObjects(scene);

        setSceneObjects(objects);
    }, []);

    const handleNodeClick = (object) => {
        setSelectedObject({name: object.name});
    };

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
                            selectedObject={selectedObject} uploadedModelFile={uploadedModelFile}/>
                    </Grid>
                    <Grid item xs={2} style={{height: '80vh'}}>
                        <ModelPanel setUploadedModelFile={setUploadedModelFile}/>

                        <CanvasSettingsPanel setCanvasBgColor={setBgColor} setCanvasGround={setShowGround}
                                             setCanvasGrid={setShowGroundGrid} setCanvasAxis={setShowAxis}/>

                        <CameraPanel setCameraNear={setNear} setCameraFar={setFar} setCameraFOV={setFOV} />

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

export function setSendImageFunc3dmodel(sendImage) {
    _sendImage = sendImage;
}

window.create3dmodelLoaderApp = create3dmodelLoaderApp;
window.setSendImageFunc3dmodel = setSendImageFunc3dmodel;


