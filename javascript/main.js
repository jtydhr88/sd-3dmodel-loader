var scene3DModel;
var camera3DModel;
var mixer3DModel;
var action3DModel;
var isPlay3DModel;
var renderer3DModel;
var axes3DModel;
var groundMesh3DModel;
var groundGrid3DModel;
var webGLOutputDiv3DModel;
var mainObject3DModel;
var orbitController3DModel;
var canvasWidth3DModel;
var canvasHeight3DModel;

function check3DModelWebGLOutputDivVisible() {
    if ((webGLOutputDiv3DModel.offsetWidth > 0) && (webGLOutputDiv3DModel.offsetHeight > 0)) {
        return true;
    }

    return false;
}

function updateModel3DModel(modelScalePage) {
    var object = scene3DModel.getObjectByName("mainObject3DModel");
    var modelScale = Number(modelScalePage);

    if (object) {
        object.scale.set(modelScale, modelScale, modelScale);
    }
}

function setGroundVisible3DModel(haGround) {
    groundMesh3DModel.visible = haGround;
}

function setGroundGridVisible3DModel(haGround) {
    groundGrid3DModel.visible = haGround;
}

function setAxisVisible3DModel(hasAxis) {
    axes3DModel.visible = hasAxis;
}

function setCanvasSize3DModel(width, height) {
    renderer3DModel.setSize(width, height);
    camera3DModel.aspect = width / height;
    camera3DModel.updateProjectionMatrix();
    webGLOutputDiv3DModel.setAttribute("style", `width: ${width + 2}px; height: ${height + 2}px; border: 0.5px solid;`);
    canvasWidth3DModel = width;
    canvasHeight3DModel = height;
}

function setBGColor3DModel(gColor) {
    renderer3DModel.setClearColor(new THREE.Color(gColor));
}

function setGroundColor3DModel(gColor) {
    groundMesh3DModel.material.color = new THREE.Color(gColor);
}

function playAndPause3DModel() {
    if (isPlay3DModel) {
        isPlay3DModel = false;
    } else if (action3DModel) {
        action3DModel.play();
        isPlay3DModel = true;
    }
}

function stop3DModel() {
    if (action3DModel) {
        action3DModel.stop();
    }
    isPlay3DModel = false;
}

function removeMainObject3DModel() {
    var object = scene3DModel.getObjectByName("mainObject3DModel");

    if (object) {
        scene3DModel.remove(object);
    }
}

function scaleObjectToProper3DModel(object) {
    const boundingBox = new THREE.Box3();

    boundingBox.setFromObject(object);

    const expectRadius = 20;
    const radius = boundingBox.getBoundingSphere(new THREE.Sphere()).radius;
    const modelScale = expectRadius / radius;

    object.scale.set(modelScale, modelScale, modelScale);
}

function isGLTF1(contents) {
    let resultContent;

    if (typeof contents === 'string') {
        // contents is a JSON string
        resultContent = contents;
    } else {
        const magic = THREE.LoaderUtils.decodeText(new Uint8Array(contents, 0, 4));

        if (magic === 'glTF') {
            // contents is a .glb file; extract the version
            const version = new DataView(contents).getUint32(4, true);
            return version < 2;
        } else {
            // contents is a .gltf file
            resultContent = THREE.LoaderUtils.decodeText(new Uint8Array(contents));
        }
    }

    const json = JSON.parse(resultContent);
    return (json.asset != undefined && json.asset.version[ 0 ] < 2);
}

function uploadFile3DModel(file) {
    var filename = file.name;
    var extension = filename.split('.').pop().toLowerCase();
    var manager = new THREE.LoadingManager();

    removeMainObject3DModel();

    switch (extension) {
        case 'obj':
            var loader = new THREE.OBJLoader();
            loader.load(file.data, function(object) {
                object.name = "mainObject3DModel";
                scaleObjectToProper3DModel(object);
                scene3DModel.add(object);
            });
            break;
        case 'stl':
            var loader = new THREE.STLLoader();
            loader.load(file.data, function(object) {
                var material = new THREE.MeshStandardMaterial();
                geometry.sourceType = "stl";
                geometry.sourceFile = file.name;
                
                object = new THREE.Mesh(geometry, material);
                object.name = "mainObject3DModel";
                
                scaleObjectToProper3DModel(object);
                scene3DModel.add(object);
            });
            break;
        case 'fbx':
            var loader = new THREE.FBXLoader(manager);
            loader.load(file.data, function(object) {
                mixer3DModel = new THREE.AnimationMixer(object);

                if (object.animations[0]) {
                    action3DModel = mixer3DModel.clipAction(object.animations[0]);

                    action3DModel.play();
                }

                object.traverse(function(child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                object.name = "mainObject3DModel";
                scaleObjectToProper3DModel(object);
                scene3DModel.add(object);
            });
            break;
        case 'gltf':
            let loader;

            if (isGLTF1(atob(file.data.split(",")[1]))) {
                alert( 'Import of glTF asset not possible. Only versions >= 2.0 are supported. Please try to upgrade the file to glTF 2.0 using glTF-Pipeline.' );
            } else {
                const dracoLoader = new THREE.DRACOLoader();
                //dracoLoader.setDecoderPath( '.' );

                loader = new THREE.GLTFLoader(manager);
                loader.setDRACOLoader(dracoLoader);
            }
            
            loader.load(file.data, function(result) {
                const scene = result.scene;
                scene.name = "mainObject3DModel";
                scene.animations.push(result.animations);
                scene3DModel.add(scene);
            });
            break;
        case 'glb':
            const dracoLoader = new THREE.DRACOLoader();
            //dracoLoader.setDecoderPath( '.' );

            const loader = new THREE.GLTFLoader();
            loader.setDRACOLoader(dracoLoader);
            loader.load(file.data, function(result) {
                const scene = result.scene;
                scene.name = "mainObject3DModel";
                scene.animations.push(result.animations);
                scene3DModel.add(scene);
            });
            break;
        case 'dae':
            const loader = new THREE.ColladaLoader(manager);
            loader.load(contents, function(object) {
                object.scene.name = "mainObject3DModel";
                scene3DModel.add(object.scene);
            });
            break;
    }
    isPlay3DModel = true;
}

function restCanvasAndCamera3DModel() {
    removeMainObject3DModel();
    resetCamera3DModel();
}

function resetCamera3DModel() {
    // position and point the camera to the center of the scene
    camera3DModel.position.x = -30;
    camera3DModel.position.y = 40;
    camera3DModel.position.z = 30;
    camera3DModel.lookAt(scene3DModel.position);
}

function initWebGLOutput3DModel(webGLOutputDiv3DModel) {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene3DModel = new THREE.Scene();
    var clock3DModel = new THREE.Clock();

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene3DModel.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene3DModel.add(light);

    var width = webGLOutputDiv3DModel.getAttribute("canvas_width");
    var height = webGLOutputDiv3DModel.getAttribute("canvas_height");

    canvasWidth3DModel = width;
    canvasHeight3DModel = height;

    camera3DModel = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    resetCamera3DModel();

    renderer3DModel = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true
    });

    var bgColor = webGLOutputDiv3DModel.getAttribute("canvas_bg_color");

    renderer3DModel.setClearColor(new THREE.Color(bgColor));
    renderer3DModel.setSize(width, height);
    renderer3DModel.shadowMap.enabled = true;

    var hasAxis = webGLOutputDiv3DModel.getAttribute("has_axis");

    axes3DModel = new THREE.AxesHelper(2000);
    scene3DModel.add(axes3DModel);

    if (hasAxis == 'True') {
        axes3DModel.visible = true;
    } else {
        axes3DModel.visible = false;
    }

    groundMesh3DModel = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0xEEEEEE,
        depthWrite: false
    }));

    groundMesh3DModel.rotation.x = -Math.PI / 2;
    groundMesh3DModel.receiveShadow = true;
    scene3DModel.add(groundMesh3DModel);

    groundGrid3DModel = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    groundGrid3DModel.material.opacity = 0.2;
    groundGrid3DModel.material.transparent = true;
    scene3DModel.add(groundGrid3DModel);

    var hasGround = webGLOutputDiv3DModel.getAttribute("has_ground");

    if (hasGround == 'True') {
        groundMesh3DModel.visible = true;
    } else {
        groundMesh3DModel.visible = false;
    }
    
    var hasGroundGrid = webGLOutputDiv3DModel.getAttribute("has_ground_grid");

    if (hasGroundGrid == 'True') {
        groundGrid3DModel.visible = true;
    } else {
        groundGrid3DModel.visible = false;
    }

    webGLOutputDiv3DModel.appendChild(renderer3DModel.domElement);

    webGLOutputDiv3DModel.addEventListener(
        "mouseenter",
        (event) => {
            orbitController3DModel.enabled = true;
        },
        false
    );

    webGLOutputDiv3DModel.addEventListener(
        "mouseleave",
        (event) => {
            orbitController3DModel.enabled = false;
        },
        false
    );

    webGLOutputDiv3DModel.addEventListener(
        "mousedown",
        (event) => {
            if (event.button == 1) {
                orbitController3DModel.screenSpacePanning  = false;
            }
        },
        false
    );

    webGLOutputDiv3DModel.addEventListener(
        "mouseup",
        (event) => {
            if (event.button == 1) {
                orbitController3DModel.screenSpacePanning  = true;
            }
        },
        false
    );

    orbitController3DModel = new THREE.OrbitControls(camera3DModel, renderer3DModel.domElement);
    orbitController3DModel.enabled = false;
    orbitController3DModel.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN };

    isPlay3DModel = true;
    render3DModel();

    function render3DModel() {
        requestAnimationFrame(render3DModel);

        if (check3DModelWebGLOutputDivVisible()) {
            orbitController3DModel.update();

            var delta = clock3DModel.getDelta();

            if (mixer3DModel && isPlay3DModel) {
                mixer3DModel.update(delta);
            }

            renderer3DModel.render(scene3DModel, camera3DModel);
        }
    }
}

function sendImage3DModel(type, index) {
    renderer3DModel.domElement.toBlob((blob) => {
        const file = new File([blob], "pose.png")
        const dt = new DataTransfer();
        dt.items.add(file);
        const list = dt.files
        const selector = type === "txt2img" ? "#txt2img_script_container" : "#img2img_script_container"

        if (type === "txt2img") {
            switch_to_txt2img()
        } else if (type === "img2img") {
            switch_to_img2img()
        }

        const accordion = gradioApp().querySelector(selector).querySelector("#controlnet .transition");
        if (accordion.classList.contains("rotate-90")) {
            accordion.click()
        }

        const tabs = gradioApp().querySelector(selector).querySelectorAll("#controlnet > div:nth-child(2) > .tabs > .tabitem, #controlnet > div:nth-child(2) > div:not(.tabs)")
        const tab = tabs[index]
        if (tab.classList.contains("tabitem")) {
            tab.parentElement.firstElementChild.querySelector(`:nth-child(${Number(index) + 1})`).click()
        }
        const input = tab.querySelector("input[type='file']")
        try {
            input.previousElementSibling.previousElementSibling.querySelector("button[aria-label='Clear']").click()
        } catch (e) {
            console.error(e)
        }
        input.value = "";
        input.files = list;
        const event = new Event('change', {
            'bubbles': true,
            "composed": true
        });
        input.dispatchEvent(event);
    });
}

let executed_webGL_output_3dmodel = false;

window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((m) => {
        if (!executed_webGL_output_3dmodel && gradioApp().querySelector('#WebGL-output-3dmodel')) {
            executed_webGL_output_3dmodel = true;
            webGLOutputDiv3DModel = gradioApp().querySelector('#WebGL-output-3dmodel');
            initWebGLOutput3DModel(webGLOutputDiv3DModel)

            observer.disconnect();
        }
    });

    observer.observe(gradioApp(), {
        childList: true,
        subtree: true
    });
})
