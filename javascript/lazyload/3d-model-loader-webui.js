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
    playAndPause, stop, setMultiFiles, setEntryType, rotateModel, setCurrentAnimationTime,
    loadPoseFile, savePoseAsJson, loadPoseFromJson, poseRotate
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

    window.loadPoseFile3DModel = function() {
        loadPoseFile();
    };

    window.savePoseAsJson3DModel = function() {
        savePoseAsJson();
    };

    window.loadPoseFromJson3DModel = function() {
        loadPoseFromJson();
    };

    window.poseRotate3DModel = function(name, x, y, z, i1, i2, i3) {
        poseRotate(name, Math.PI * x * i1, Math.PI * y * i2, Math.PI * z * i3 )
    };
})();
