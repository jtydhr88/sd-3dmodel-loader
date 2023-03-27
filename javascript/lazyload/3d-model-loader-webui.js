console.log('[3D Model Loader] loading...');

async function _import() {
    if (!globalThis.threeDModelLoader || !globalThis.threeDModelLoader.import) {
        return await import('threeDModelLoader');
    } else {
        return await globalThis.threeDModelLoader.imports.threeDModelLoader();
    }
}

const {
    init_3d, setAxisVisible, setGroundVisible, setGridVisible, setBGColor, setGroundColor, setCanvasSize,
    uploadFile, setLightColor, moveLight, updateModel, restCanvasAndCamera, sendImage,
    playAndPause, stop, setMultiFiles, setEntryType, rotateModel, setCurrentAnimationTime, poseRotateNeck,
    poseRotateLeftUpperArm, poseRotateRightUpperArm, poseRotateLeftLowerArm, poseRotateRightLowerArm,
    poseRotateLeftUpperLeg, poseRotateRightUpperLeg, poseRotateLeftLowerLeg, poseRotateRightLowerLeg,
    poseRotateLeftHand, poseRotateRightHand, poseRotateLeftFoot, poseRotateRightFoot, poseRotateSpine,
    loadPoseFile, savePoseAsJson, loadPoseFromJson, poseRotateLeftThumbMetacarpal, poseRotateLeftThumbProximal,
    poseRotateLeftThumbDistal, poseRotateLeftIndexProximal, poseRotateLeftIndexIntermediate,
    poseRotateLeftIndexDistal, poseRotateLeftMiddleProximal, poseRotateLeftMiddleIntermediate,
    poseRotateLeftMiddleDistal, poseRotateLeftRingProximal, poseRotateLeftRingIntermediate,
    poseRotateLeftRingDistal, poseRotateLeftLittleProximal, poseRotateLeftLittleIntermediate,
    poseRotateLeftLittleDistal, poseRotateRightThumbMetacarpal, poseRotateRightThumbProximal,
    poseRotateRightThumbDistal, poseRotateRightIndexProximal, poseRotateRightIndexIntermediate,
    poseRotateRightIndexDistal, poseRotateRightMiddleProximal, poseRotateRightMiddleIntermediate,
    poseRotateRightMiddleDistal, poseRotateRightRingProximal, poseRotateRightRingIntermediate,
    poseRotateRightRingDistal, poseRotateRightLittleProximal, poseRotateRightLittleIntermediate,
    poseRotateRightLittleDistal
} = await _import();

(async function () {
    async function init_canvas() {

        init_3d(gradioApp().querySelector('#WebGL-output-3dmodel'));

    }

    await init_canvas();

    window.setAxisVisible3DModel = function(hasAxis) {
        setAxisVisible(hasAxis);
    };

    window.setGroundVisible3DModel = function(hasGround) {
        setGroundVisible(hasGround);
    };

    window.setGroundGridVisible3DModel = function(hasGroundGrid) {
        setGridVisible(hasGroundGrid);
    };

    window.setBGColor3DModel = function(gColor) {
        setBGColor(gColor);
    };

    window.setGroundColor3DModel = function(gColor) {
        setGroundColor(gColor);
    };

    window.setCanvasSize3DModel = function(width, height) {
        setCanvasSize(width, height);
    };

    window.uploadFile3DModel = function() {
        uploadFile();
    };

    window.setLightColor3DModel = function(gColor) {
        setLightColor(gColor);
    };

    window.moveLight3DModel = function(x, y, z) {
        moveLight(x, y, z);
    };

    window.updateModel3DModel = function(modelScale) {
        updateModel(modelScale);
    };

    window.restCanvasAndCamera3DModel = function() {
        restCanvasAndCamera();
    };

    window.sendImage3DModel = function(type, index) {
        sendImage(type, index);
    };

    window.playAndPause3DModel = function() {
        playAndPause();
    };

    window.stop3DModel = function() {
        stop();
    };

    window.setMultiFiles3DModel = function(isMultiFiles) {
        setMultiFiles(isMultiFiles);
    };

    window.setEntryType3DModel = function(entryType) {
        setEntryType(entryType);
    };

    window.rotateModel3DModel = function(x, y, z) {
        rotateModel(x, y, z);
    };

    window.setCurrentAnimationTime3DModel = function(currentTime) {
        setCurrentAnimationTime(currentTime);
    };

    window.poseRotateNeck3DModel = function(x, y, z) {
        poseRotateNeck(x, y, z);
    };

    window.poseRotateLeftUpperArm3DModel = function(x, y, z) {
        poseRotateLeftUpperArm(x, y, z);
    };

    window.poseRotateRightUpperArm3DModel = function(x, y, z) {
        poseRotateRightUpperArm(x, y, z);
    };

    window.poseRotateLeftLowerArm3DModel = function(x, y, z) {
        poseRotateLeftLowerArm(x, y, z);
    };

    window.poseRotateRightLowerArm3DModel = function(x, y, z) {
        poseRotateRightLowerArm(x, y, z);
    };

    window.poseRotateLeftUpperLeg3DModel = function(x, y, z) {
        poseRotateLeftUpperLeg(x, y, z);
    };

    window.poseRotateRightUpperLeg3DModel = function(x, y, z) {
        poseRotateRightUpperLeg(x, y, z);
    };

    window.poseRotateLeftLowerLeg3DModel = function(x, y, z) {
        poseRotateLeftLowerLeg(x, y, z);
    };

    window.poseRotateRightLowerLeg3DModel = function(x, y, z) {
        poseRotateRightLowerLeg(x, y, z);
    };

    window.poseRotateLeftHand3DModel = function(x, y, z) {
        poseRotateLeftHand(x, y, z);
    };

    window.poseRotateRightHand3DModel = function(x, y, z) {
        poseRotateRightHand(x, y, z);
    };

    window.poseRotateLeftFoot3DModel = function(x, y, z) {
        poseRotateLeftFoot(x, y, z);
    };

    window.poseRotateRightFoot3DModel = function(x, y, z) {
        poseRotateRightFoot(x, y, z);
    };

    window.poseRotateSpine3DModel = function(x, y, z) {
        poseRotateSpine(x, y, z);
    };

    window.loadPoseFile3DModel = function() {
        loadPoseFile();
    };

    window.savePoseAsJson3DModel = function() {
        savePoseAsJson();
    };

    window.loadPoseFromJson3DModel = function() {
        loadPoseFromJson();
    };

    window.poseRotateLeftThumbMetacarpal3DModel = function(x, y, z) {
        poseRotateLeftThumbMetacarpal(x, y, z);
    };

    window.poseRotateLeftThumbProximal3DModel = function(x, y, z) {
        poseRotateLeftThumbProximal(x, y, z);
    };

    window.poseRotateLeftThumbDistal3DModel = function(x, y, z) {
        poseRotateLeftThumbDistal(x, y, z);
    };

    window.poseRotateLeftIndexIntermediate3DModel = function(x, y, z) {
        poseRotateLeftIndexIntermediate(x, y, z);
    };

    window.poseRotateLeftIndexProximal3DModel = function(x, y, z) {
        poseRotateLeftIndexProximal(x, y, z);
    };

    window.poseRotateLeftIndexDistal3DModel = function(x, y, z) {
        poseRotateLeftIndexDistal(x, y, z);
    };

    window.poseRotateLeftMiddleIntermediate3DModel = function(x, y, z) {
        poseRotateLeftMiddleIntermediate(x, y, z);
    };

    window.poseRotateLeftMiddleProximal3DModel = function(x, y, z) {
        poseRotateLeftMiddleProximal(x, y, z);
    };

    window.poseRotateLeftMiddleDistal3DModel = function(x, y, z) {
        poseRotateLeftMiddleDistal(x, y, z);
    };

    window.poseRotateLeftRingIntermediate3DModel = function(x, y, z) {
        poseRotateLeftRingIntermediate(x, y, z);
    };

    window.poseRotateLeftRingProximal3DModel = function(x, y, z) {
        poseRotateLeftRingProximal(x, y, z);
    };

    window.poseRotateLeftRingDistal3DModel = function(x, y, z) {
        poseRotateLeftRingDistal(x, y, z);
    };

    window.poseRotateLeftLittleIntermediate3DModel = function(x, y, z) {
        poseRotateLeftLittleIntermediate(x, y, z);
    };

    window.poseRotateLeftLittleProximal3DModel = function(x, y, z) {
        poseRotateLeftLittleProximal(x, y, z);
    };

    window.poseRotateLeftLittleDistal3DModel = function(x, y, z) {
        poseRotateLeftLittleDistal(x, y, z);
    };


    window.poseRotateRightThumbMetacarpal3DModel = function(x, y, z) {
        poseRotateRightThumbMetacarpal(x, y, z);
    };

    window.poseRotateRightThumbProximal3DModel = function(x, y, z) {
        poseRotateRightThumbProximal(x, y, z);
    };

    window.poseRotateRightThumbDistal3DModel = function(x, y, z) {
        poseRotateRightThumbDistal(x, y, z);
    };

    window.poseRotateRightIndexIntermediate3DModel = function(x, y, z) {
        poseRotateRightIndexIntermediate(x, y, z);
    };

    window.poseRotateRightIndexProximal3DModel = function(x, y, z) {
        poseRotateRightIndexProximal(x, y, z);
    };

    window.poseRotateRightIndexDistal3DModel = function(x, y, z) {
        poseRotateRightIndexDistal(x, y, z);
    };

    window.poseRotateRightMiddleIntermediate3DModel = function(x, y, z) {
        poseRotateRightMiddleIntermediate(x, y, z);
    };

    window.poseRotateRightMiddleProximal3DModel = function(x, y, z) {
        poseRotateRightMiddleProximal(x, y, z);
    };

    window.poseRotateRightMiddleDistal3DModel = function(x, y, z) {
        poseRotateRightMiddleDistal(x, y, z);
    };

    window.poseRotateRightRingIntermediate3DModel = function(x, y, z) {
        poseRotateRightRingIntermediate(x, y, z);
    };

    window.poseRotateRightRingProximal3DModel = function(x, y, z) {
        poseRotateRightRingProximal(x, y, z);
    };

    window.poseRotateRightRingDistal3DModel = function(x, y, z) {
        poseRotateRightRingDistal(x, y, z);
    };

    window.poseRotateRightLittleIntermediate3DModel = function(x, y, z) {
        poseRotateRightLittleIntermediate(x, y, z);
    };

    window.poseRotateRightLittleProximal3DModel = function(x, y, z) {
        poseRotateRightLittleProximal(x, y, z);
    };

    window.poseRotateRightLittleDistal3DModel = function(x, y, z) {
        poseRotateRightLittleDistal(x, y, z);
    };



})();
