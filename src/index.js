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
    importBonesJSON,
    downloadOpenposeJSON
} from './ThreeJsScene';
import {setCameraNear, setCameraFOV, setCameraFar} from './ThreeJSScene/Camera'

import ScenePanel from './ScenePanel'
import AnimationPanel from './AnimationPanel'
import SendToDownloadPanel from './SendToDownloadPanel'
import ModelPanel from './ModelPanel'
import HandPanel from './HandPanel'
import RenderPanel from "./RenderPanel";
import PosePanel from "./PosePanel";
import SizePanel from "./SizePanel";
import OperatePanel from "./OperatePanel";
import LoadModelPanel from "./LoadModelPanel";
import {IntlProvider} from 'react-intl';
import {FormattedMessage} from 'react-intl';

import en from './translations/en.json';
import zh_CN from './translations/zh_CN.json';
import zh_TW from './translations/zh_TW.json';
import ja from './translations/ja.json';
import fr from './translations/fr.json';

let _sendImage;

const messages = {
    "en": en,
    "zh-CN": zh_CN,
    "zh-TW": zh_TW,
    "ja": ja,
    "fr": fr
};

export default function App({configs}) {
    const lang = configs.lang;

    const [uploadedModelFile, setUploadedModelFile] = useState(null);

    return (<>
        <IntlProvider locale={lang} messages={messages[lang]}>
            <Container maxWidth="none">
                <Grid container spacing={1}>
                    <Grid item xs={10} style={{height: '80vh'}}>
                        <Grid container item xs={12} spacing={3}>
                            <Grid item xs={2}>
                                <ModelPanel setUploadedModelFile={setUploadedModelFile}/>
                            </Grid>

                            <Grid item xs={3}>
                                <FormattedMessage id="load-hand-model" defaultMessage="Load Hand Model">
                                    {(labelName) => (
                                        <LoadModelPanel
                                            configs={configs}
                                            setPoseModelFileName={loadPoseModel}
                                            modelNames={{"hand-right": "hand/hand_right.fbx"}}
                                            labelName={labelName}
                                        />
                                    )}
                                </FormattedMessage>
                            </Grid>
                            <Grid item xs={3}>
                                <FormattedMessage id="load-body-model" defaultMessage="Load Body Model">
                                    {(labelName) => (
                                        <LoadModelPanel configs={configs} setPoseModelFileName={loadPoseModel}
                                                        modelNames={{
                                                            "kachujin": "body/kachujin.fbx",
                                                            "vanguard": "body/vanguard.fbx",
                                                            "warrok": "body/warrok.fbx",
                                                            "y-bot": "body/ybot.fbx"
                                                        }}
                                                        labelName={labelName}/>
                                    )}
                                </FormattedMessage>
                            </Grid>
                            <Grid item xs={2}>
                                <RenderPanel setRenderMode={setRenderMode} setDepthContrast={setDepthContrast}/>
                            </Grid>
                            <Grid item xs={1}>
                                <OperatePanel setOperateMode={setOperateMode}/>
                            </Grid>
                            <Grid item xs={1}>
                                <SizePanel setPreviewSize={setPreviewSize}/>
                            </Grid>
                        </Grid>
                        <ThreeJsScene
                            configs={configs}
                            uploadedModelFile={uploadedModelFile}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <HandPanel configs={configs} showHandBones={showHandBones} exportBonesJSON={exportBonesJSON}
                                   importBonesJSON={importBonesJSON}/>

                        <PosePanel configs={configs} showBodyBones={showBodyBones} exportBonesJSON={exportBonesJSON}
                                   importBonesJSON={importBonesJSON}/>

                        <ScenePanel configs={configs} refreshSceneTree={refreshSceneTree}
                                    handleSelectedObject={handleSelectedObject}
                                    setVisible={setVisible}
                                    setCameraNear={setCameraNear} setCameraFar={setCameraFar}
                                    setCameraFOV={setCameraFOV}
                                    setCanvasBgColor={setBgColor} removeObject={removeObject}
                                    setGroundColor={setGroundColor}/>
                        <SendToDownloadPanel configs={configs}
                                             setRendererImage={setRendererImage}
                                             sendImage={_sendImage} downloadRendererImage={downloadRendererImage}
                                             sendRendererImageToCanvasEditor={sendRendererImageToCanvasEditor}
                                             downloadOpenposeJSON={downloadOpenposeJSON}/>
                        <AnimationPanel setAnimationPlaying={setPlaying} setAnimationStopPlaying={setStopPlaying}
                                        controlAnimation={controlAnimationProgress}/>
                    </Grid>
                </Grid>
            </Container>
        </IntlProvider>
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
        "defaultShowAxis": "False" === "True",
        "lang": "zh-CN",
        "resourcePath": "http://127.0.0.1:3001/"
    }

    root.render(<App configs={configs}/>);
}

// enable this method for local dev, and run npm start
// localDev();