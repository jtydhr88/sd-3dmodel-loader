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
    uploadFile, setLightColor, moveOrRotateTarget, setTarget, updateModel, restCanvasAndCamera, sendImage,
    playAndPause, stop
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

    window.moveOrRotateTarget3DModel = function(x, y, z) {
        moveOrRotateTarget(x, y, z);
    };

    window.setTarget3DModel = function(target) {
        setTarget(target);
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

})();
