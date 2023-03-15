async function _import() {
    if (!globalThis.threeDModelLoader || !globalThis.threeDModelLoader.import) {
        const THREE = await import('three');
        const OrbitControls = await import('three-OrbitControls');
        const OBJLoader = await import('three-OBJLoader');
        const STLLoader = await import('three-STLLoader');
        const FBXLoader = await import('three-FBXLoader');
        const GLTFLoader = await import('three-GLTFLoader');
        const DRACOLoader = await import('three-DRACOLoader');
        const ColladaLoader = await import('three-ColladaLoader');

        return { THREE, OrbitControls, OBJLoader, STLLoader, FBXLoader, GLTFLoader, DRACOLoader, ColladaLoader };
    } else {
        return await globalThis.threeDModelLoader.import();
    }
}

const {
    THREE, OrbitControls, OBJLoader, STLLoader, FBXLoader, GLTFLoader, DRACOLoader, ColladaLoader
} = await _import();

function checkDivVisible(div) {
    if ((div.offsetWidth > 0) && (div.offsetHeight > 0)) {
        return true;
    }

    return false;
}

let axes;
let groundMesh;
let groundGrid;
let renderer;
let camera;
let webGLOutputDiv;
let canvasWidth;
let canvasHeight;
let scene;
let mainObject;
let moveORRotateTarget;
let directionalLight;
let mixer;
let action;
let isPlay;

function playAndPause() {
    if (isPlay) {
        isPlay = false;
    } else if (action) {
        action.play();
        isPlay = true;
    }
}

function stop() {
    if (action) {
        action.stop();
    }
    isPlay = false;
}

function scaleObjectToProper(object) {
    const boundingBox = new THREE.Box3();

    boundingBox.setFromObject(object);

    const expectRadius = 20;

    const radius = boundingBox.getBoundingSphere(new THREE.Sphere()).radius;

    const modelScale = expectRadius / radius;

    object.scale.set(modelScale, modelScale, modelScale);
}

function removeMainObject() {
    var object = scene.getObjectByName("mainObject");

    if (object) {
        scene.remove(object);
    }
}

function isGLTF1( contents ) {

    let resultContent;

    if ( typeof contents === 'string' ) {

        // contents is a JSON string
        resultContent = contents;

    } else {

        const magic = THREE.LoaderUtils.decodeText( new Uint8Array( contents, 0, 4 ) );

        if ( magic === 'glTF' ) {

            // contents is a .glb file; extract the version
            const version = new DataView( contents ).getUint32( 4, true );

            return version < 2;

        } else {

            // contents is a .gltf file
            resultContent = THREE.LoaderUtils.decodeText( new Uint8Array( contents ) );

        }

    }

    const json = JSON.parse( resultContent );

    return ( json.asset != undefined && json.asset.version[ 0 ] < 2 );

}

function uploadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".obj, .stl, .fbx, .gltf, .glb, .dae";

    input.addEventListener("change", function(e) {
        const file = e.target.files[0];
        var filename = file.name;
        var extension = filename.split('.').pop().toLowerCase();
        var reader = new FileReader();
        var manager = new THREE.LoadingManager();

        removeMainObject();

        switch (extension) {
            case 'obj':
                reader.addEventListener('load', function(event) {
                    var contents = event.target.result;

                    mainObject = new OBJLoader().parse(contents);
                    mainObject.name = "mainObject";

                    scaleObjectToProper(mainObject);

                    scene.add(mainObject);
                }, false);

                reader.readAsText(file);

                break;
            case 'stl':
                reader.addEventListener('load', function(event) {
                    var contents = event.target.result;
                    var geometry = new STLLoader().parse(contents);
                    var material = new THREE.MeshStandardMaterial();

                    geometry.sourceType = "stl";
                    geometry.sourceFile = file.name;

                    mainObject = new THREE.Mesh(geometry, material);
                    mainObject.name = "mainObject";

                    scaleObjectToProper(mainObject);

                    scene.add(mainObject);
                }, false);

                if (reader.readAsBinaryString !== undefined) {
                    reader.readAsBinaryString(file);
                } else {
                    reader.readAsArrayBuffer(file);
                }

                break;
            case 'fbx':
                reader.addEventListener('load', function(event) {
                    var contents = event.target.result;
                    var loader = new FBXLoader(manager);
                    mainObject = loader.parse(contents);
                    mixer = new THREE.AnimationMixer(mainObject);

                    if (mainObject.animations[0]) {
                        action = mixer.clipAction(mainObject.animations[0]);

                        action.play();
                    }

                    mainObject.traverse(function(child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    mainObject.name = "mainObject";

                    scaleObjectToProper(mainObject);

                    scene.add(mainObject);
                }, false);

                reader.readAsArrayBuffer(file);
                break;
            case 'gltf':
                reader.addEventListener('load', function(event) {
                    const contents = event.target.result;

					let loader;

					if ( isGLTF1( contents ) ) {

						alert( 'Import of glTF asset not possible. Only versions >= 2.0 are supported. Please try to upgrade the file to glTF 2.0 using glTF-Pipeline.' );

					} else {
						const dracoLoader = new DRACOLoader();
						//dracoLoader.setDecoderPath( '.' );

						loader = new GLTFLoader( manager );
						loader.setDRACOLoader( dracoLoader );
					}

					loader.parse( contents, '', function ( result ) {
						const resultScene = result.scene;
						resultScene.name = "mainObject";

						resultScene.animations.push( ...result.animations );

						scene.add(resultScene);
					} );

                }, false);

                reader.readAsArrayBuffer( file );

                break;
            case 'glb':
                reader.addEventListener('load', function(event) {
                    const contents = event.target.result;

					const dracoLoader = new DRACOLoader();
					//dracoLoader.setDecoderPath( '.' );

					const loader = new GLTFLoader();

					loader.setDRACOLoader( dracoLoader );

					loader.parse( contents, '', function ( result ) {
						const resultScene = result.scene;
						resultScene.name = "mainObject";

						resultScene.animations.push( ...result.animations );

						scene.add(resultScene);
					} );

                }, false);

                reader.readAsArrayBuffer( file );

                break;

            case 'dae':
			{
				reader.addEventListener( 'load', async function ( event ) {
					const contents = event.target.result;

					const loader = new ColladaLoader( manager );

					const collada = loader.parse( contents );

					collada.scene.name = "mainObject";

                    scene.add(collada.scene);

				}, false );
				reader.readAsText( file );

				break;

			}
        }
    })
    input.click();
    isPlay = true;
}

function setGroundVisible(haGround) {
    groundMesh.visible = haGround;
}

function setGridVisible(hasGrid) {
    groundGrid.visible = hasGrid;
}

function setAxisVisible(hasAxis) {
    axes.visible = hasAxis;
}

function setCanvasSize(width, height) {
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    webGLOutputDiv.setAttribute("style", `width: ${width + 2}px; height: ${height + 2}px; border: 0.5px solid;`);

    canvasWidth = width;
    canvasHeight = height;
}

function setBGColor(gColor) {
    renderer.setClearColor(new THREE.Color(gColor));
}

function setLightColor(gColor) {
    directionalLight.color = new THREE.Color(gColor);
}

function setGroundColor(gColor) {
    groundMesh.material.color = new THREE.Color(gColor);
}

function restCanvasAndCamera() {
    removeMainObject();
    resetCamera();
}

function resetCamera() {
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;

    camera.lookAt(scene.position);
}

function moveOrRotateTarget(x, y, z) {
	if (moveORRotateTarget) {
		if (moveORRotateTarget == "Model") {
			var object = scene.getObjectByName("mainObject");

			object.rotation.x = Math.PI * x;
			object.rotation.y = Math.PI * y;
			object.rotation.z = Math.PI * z;
		}
		else if (moveORRotateTarget == "Light") {
			directionalLight.position.x = x * 50;
			directionalLight.position.y = y * 50;
			directionalLight.position.z = z * 50;
		}
	}
}

function setTarget(target) {
	moveORRotateTarget = target;
}

function updateModel(modelScale) {
    var object = scene.getObjectByName("mainObject");
    var s = Number(modelScale);

    if (object) {
        object.scale.set(s, s, s);
    }
}

function init_3d(webGLOutputDiv3DModel) {
    webGLOutputDiv = webGLOutputDiv3DModel;

    scene = new THREE.Scene();

    const clock3DModel = new THREE.Clock();

    const hemisphereLight3DModel = new THREE.HemisphereLight(0xffffff, 0x444444);

    hemisphereLight3DModel.position.set(0, 200, 0);

    scene.add(hemisphereLight3DModel);

    directionalLight = new THREE.DirectionalLight(0xffffff);

    directionalLight.position.set(0, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 180;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.left = -120;
    directionalLight.shadow.camera.right = 120;

    scene.add(directionalLight);

    const width = webGLOutputDiv3DModel.getAttribute("canvas_width");
    const height = webGLOutputDiv3DModel.getAttribute("canvas_height");

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true
    });

    const bgColor = webGLOutputDiv3DModel.getAttribute("canvas_bg_color");

    renderer.setClearColor(new THREE.Color(bgColor));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    const hasAxis = webGLOutputDiv3DModel.getAttribute("has_axis");

    axes = new THREE.AxesHelper(2000);

    scene.add(axes);

    if (hasAxis == 'True') {
        axes.visible = true;
    } else {
        axes.visible = false;
    }

    groundMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0xEEEEEE,
        depthWrite: false
    }));

    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;

    scene.add(groundMesh);

    var hasGround = webGLOutputDiv3DModel.getAttribute("has_ground");

    if (hasGround == 'True') {
        groundMesh.visible = true;
    } else {
        groundMesh.visible = false;
    }

    groundGrid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);

    groundGrid.material.opacity = 0.2;
    groundGrid.material.transparent = true;

    scene.add(groundGrid);

    var hasGroundGrid = webGLOutputDiv3DModel.getAttribute("has_ground_grid");

    if (hasGroundGrid == 'True') {
        groundGrid.visible = true;
    } else {
        groundGrid.visible = false;
    }

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

    const orbitController3DModel = new OrbitControls(camera, renderer.domElement);

    orbitController3DModel.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN };

    webGLOutputDiv3DModel.appendChild(renderer.domElement);

    isPlay = true;

    render();

    function render() {
        requestAnimationFrame(render);

        if (checkDivVisible(webGLOutputDiv3DModel)) {
            orbitController3DModel.update();

            var delta = clock3DModel.getDelta();

            if (mixer && isPlay) {
                mixer.update(delta);
            }

            renderer.render(scene, camera);
        }
    }
}

function sendImage(type, index) {
    renderer.domElement.toBlob((blob) => {
        const file = new File([blob], "pose.png")
        const dt = new DataTransfer();
        dt.items.add(file);
        const list = dt.files;
        const selector = type === "txt2img" ? "#txt2img_script_container" : "#img2img_script_container";

        if (type === "txt2img") {
            switch_to_txt2img();
        } else if (type === "img2img") {
            switch_to_img2img();
        }

        const accordion = gradioApp().querySelector(selector).querySelector("#controlnet .transition");
        if (accordion.classList.contains("rotate-90")) {
            accordion.click();
        }

        const tabs = gradioApp().querySelector(selector).querySelectorAll("#controlnet > div:nth-child(2) > .tabs > .tabitem, #controlnet > div:nth-child(2) > div:not(.tabs)");
        const tab = tabs[index];
        if (tab.classList.contains("tabitem")) {
            tab.parentElement.firstElementChild.querySelector(`:nth-child(${Number(index) + 1})`).click();
        }
        const input = tab.querySelector("input[type='file']");
        try {
            if (input.previousElementSibling.previousElementSibling) {
                input.previousElementSibling.previousElementSibling.querySelector("button[aria-label='Clear']").click();
            }
        } catch (e) {
            console.error(e);
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

export {
    init_3d, setAxisVisible, setGroundVisible, setGridVisible, setBGColor, setGroundColor, setCanvasSize,
    uploadFile, setLightColor, moveOrRotateTarget, setTarget, updateModel, restCanvasAndCamera, sendImage,
    playAndPause, stop
};