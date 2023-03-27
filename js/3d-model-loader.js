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

async function _import_vmr() {
    if (!globalThis.threeDModelLoader || !globalThis.threeDModelLoader.import) {
        const {VRMLoaderPlugin, VRMUtils} = await import('three-vrm');

        return { VRMLoaderPlugin, VRMUtils};
    } else {
        return await globalThis.threeDModelLoader.imports.threeVRM();
    }
}

async function _import_loadMixamoAnimation() {
    if (!globalThis.threeDModelLoader || !globalThis.threeDModelLoader.import) {
        const loadMixamoAnimation = await import('loadMixamoAnimation');

        return { VRMLoaderPlugin };
    } else {
        return await globalThis.threeDModelLoader.imports.loadMixamoAnimation();
    }
}

const {
    THREE, OrbitControls, OBJLoader, STLLoader, FBXLoader, GLTFLoader, DRACOLoader, ColladaLoader
} = await _import();

const {
    VRMLoaderPlugin, VRMUtils
} = await _import_vmr();

const {
    loadMixamoAnimation
} = await _import_loadMixamoAnimation();

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
let directionalLight;
let mixer;
let action;
let isPlay;
let multiFiles = false;
let entryType;
let currentVRM;
let totalTime;
let currentTime;
let progress;
let controlByProgressBar;

function updateSliderValue(queryId, newValue) {
    const sliderDiv = gradioApp().querySelector(queryId);

    if (sliderDiv) {
        const sliderInputs = sliderDiv.querySelectorAll("input");

        for (let i = 0; i < sliderInputs.length; i++) {
            const sliderInput = sliderInputs[i];

            sliderInput.value = newValue.toFixed(2);
        }
    }
}

function savePoseAsJson() {
    if (currentVRM) {
        const poseData = {
          "poses": [
              {
                  "name": "pose1",
                  "poseData": [
                      {
                          "boneName": "neck",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'neck' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'neck' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'neck' ).rotation.z
                      },
                      {
                          "boneName": "spine",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'spine' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'spine' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'spine' ).rotation.z
                      },
                      {
                          "boneName": "leftUpperArm",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).rotation.z
                      },
                      {
                          "boneName": "rightUpperArm",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperArm' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperArm' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperArm' ).rotation.z
                      },
                      {
                          "boneName": "leftLowerArm",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerArm' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerArm' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerArm' ).rotation.z
                      },
                      {
                          "boneName": "rightLowerArm",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerArm' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerArm' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerArm' ).rotation.z
                      },
                      {
                          "boneName": "leftUpperLeg",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperLeg' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperLeg' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperLeg' ).rotation.z
                      },
                      {
                          "boneName": "rightUpperLeg",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperLeg' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperLeg' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperLeg' ).rotation.z
                      },
                      {
                          "boneName": "leftLowerLeg",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerLeg' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerLeg' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerLeg' ).rotation.z
                      },
                      {
                          "boneName": "rightLowerLeg",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerLeg' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerLeg' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerLeg' ).rotation.z
                      },
                      {
                          "boneName": "leftHand",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'leftHand' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'leftHand' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'leftHand' ).rotation.z
                      },
                      {
                          "boneName": "rightHand",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'rightHand' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'rightHand' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'rightHand' ).rotation.z
                      },
                      {
                          "boneName": "leftFoot",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'leftFoot' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'leftFoot' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'leftFoot' ).rotation.z
                      },
                      {
                          "boneName": "rightFoot",
                          "x": currentVRM.humanoid.getNormalizedBoneNode( 'rightFoot' ).rotation.x,
                          "y": currentVRM.humanoid.getNormalizedBoneNode( 'rightFoot' ).rotation.y,
                          "z": currentVRM.humanoid.getNormalizedBoneNode( 'rightFoot' ).rotation.z
                      },
                  ]
              }
          ]
        };

        const jsonData = JSON.stringify(poseData);

        const blob = new Blob([jsonData], { type: "application/json" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "poseData.json";

        document.body.appendChild(link);

        link.click();
    }
}

function loadPoseFromJson() {
    if (currentVRM) {
        const input = document.createElement("input");
        input.type = "file";

        input.accept = ".json";

        input.addEventListener("change", function(e) {
            const file = e.target.files[0];

            const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = function() {
                  const jsonData = JSON.parse(reader.result);

                  const posesData = jsonData.poses;

                  for (let i = 0; i < posesData.length; i++) {
                      const pose = posesData[i];

                      for (let t = 0; t < pose.poseData.length; t++){
                          const pd = pose.poseData[t];

                          poseRotate(pd.boneName, pd.x, pd.y, pd.z)

                          const queryId = "#pose_" + pd.boneName + "_";

                          updateSliderValue(queryId + "x", Number(pd.x) / Math.PI);
                          updateSliderValue(queryId + "y", Number(pd.y) / Math.PI);
                          updateSliderValue(queryId + "z", Number(pd.z) / Math.PI);
                      }
                  }

              };

        });
        input.click();
    }
}

function poseRotate(boneName, x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( boneName ).rotation.x = x;
        currentVRM.humanoid.getNormalizedBoneNode( boneName ).rotation.y = y;
        currentVRM.humanoid.getNormalizedBoneNode( boneName ).rotation.z = z;
    }
}

function loadPoseFile() {
    let manager = new THREE.LoadingManager();

    removeMainObject();

    const loader = new GLTFLoader( manager );
    loader.crossOrigin = 'anonymous';

    loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
    });

    let path = "/file=extensions/sd-3dmodel-loader/models/pose.vrm";

    loader.load(
        path,
        ( gltf ) => {
            const vrm = gltf.userData.vrm;

            const resultScene = vrm.scene;

            resultScene.name = "mainObject";

            scaleObjectToProper(resultScene);

            scene.add(resultScene);

            currentVRM = vrm;

            vrm.scene.traverse( ( obj ) => {

                obj.frustumCulled = false;

            } );

            VRMUtils.rotateVRM0( vrm );
        }
    )
}

function poseRotateNeck(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'neck' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'neck' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'neck' ).rotation.z = Math.PI * z;
    }
}

function poseRotateSpine(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'spine' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'spine' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'spine' ).rotation.z = Math.PI * z;
    }
}

function poseRotateLeftUpperArm(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperArm' ).rotation.z = Math.PI * z;
    }
}

function poseRotateRightUpperArm(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperArm' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperArm' ).rotation.y = -1 * Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperArm' ).rotation.z = -1 * Math.PI * z;
    }
}

function poseRotateLeftLowerArm(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerArm' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerArm' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerArm' ).rotation.z = Math.PI * z;
    }
}

function poseRotateRightLowerArm(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerArm' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerArm' ).rotation.y = -1 * Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerArm' ).rotation.z = -1 * Math.PI * z;
    }
}

function poseRotateLeftUpperLeg(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperLeg' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperLeg' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftUpperLeg' ).rotation.z = Math.PI * z;
    }
}

function poseRotateRightUpperLeg(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperLeg' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperLeg' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightUpperLeg' ).rotation.z = -1 * Math.PI * z;
    }
}

function poseRotateLeftLowerLeg(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerLeg' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerLeg' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftLowerLeg' ).rotation.z = Math.PI * z;
    }
}

function poseRotateRightLowerLeg(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerLeg' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerLeg' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightLowerLeg' ).rotation.z = -1 * Math.PI * z;
    }
}

function poseRotateLeftHand(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'leftHand' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftHand' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftHand' ).rotation.z = Math.PI * z;
    }
}

function poseRotateRightHand(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'rightHand' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightHand' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightHand' ).rotation.z = -1 * Math.PI * z;
    }
}

function poseRotateLeftFoot(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'leftFoot' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftFoot' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'leftFoot' ).rotation.z = Math.PI * z;
    }
}

function poseRotateRightFoot(x, y, z) {
    if (currentVRM) {
        currentVRM.humanoid.getNormalizedBoneNode( 'rightFoot' ).rotation.x = Math.PI * x;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightFoot' ).rotation.y = Math.PI * y;
        currentVRM.humanoid.getNormalizedBoneNode( 'rightFoot' ).rotation.z = -1 * Math.PI * z;
    }
}

function setEntryType(newEntryType) {
    entryType = newEntryType;
}

function setMultiFiles(isMultiFiles) {
    multiFiles = isMultiFiles;
}

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

    if (object.geometry) {
        const center = new THREE.Vector3();

        boundingBox.getCenter(center);

        object.geometry.translate(-center.x, -center.y, -center.z);
    }

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
    if (multiFiles) {
        if (entryType) {
            uploadMultiFiles();
        }
    }
    else {
        uploadSingleFile();
    }
}

function setCurrentAnimationTime(newCurrentTime) {
    if (action) {
        currentTime = newCurrentTime / 100 * totalTime;

        action.time = currentTime;

        controlByProgressBar = true;
    }
}

function getExtension(filename) {
  return filename.toLowerCase().split('.').pop();
}

function findEntryFileByExt(files, ext) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (getExtension(file.name) === ext) {
            return file;
        }
    }

    return undefined;
}

function uploadMultiFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    input.addEventListener("change", function(e) {
        const files = e.target.files;

        const entryFile = findEntryFileByExt(files, entryType);

        const entryFileUrl = URL.createObjectURL(entryFile);

        let manager = new THREE.LoadingManager();

        removeMainObject();

        switch (entryType) {
            case 'vrm':
                const loader = new GLTFLoader( manager );
                loader.crossOrigin = 'anonymous';

                loader.register((parser) => {
                    return new VRMLoaderPlugin(parser);
                });

                loader.load(
                    // URL of the VRM you want to load
                    entryFileUrl,

                    // called when the resource is loaded
                    ( gltf ) => {
                        const vrm = gltf.userData.vrm;

                        const resultScene = vrm.scene;

						resultScene.name = "mainObject";

                        scene.add(resultScene);

                        currentVRM = vrm;

                        vrm.scene.traverse( ( obj ) => {

                            obj.frustumCulled = false;

                        } );


                        const animationFbxFile = findEntryFileByExt(files, "fbx");

                        if (animationFbxFile) {
                            const animationFbxFileUrl = URL.createObjectURL(animationFbxFile);

                            mixer = new THREE.AnimationMixer(resultScene);

                            loadMixamoAnimation(animationFbxFileUrl, currentVRM).then((clip) => {
                                action = mixer.clipAction(clip);

                                action.play();

                                const vrmClip = action.getClip();

                                totalTime = vrmClip.duration;

                                isPlay = true;
                            });
                        }

                        VRMUtils.rotateVRM0( vrm );
                    }
                );

                break;
        }
    });

    input.click();
}

function uploadSingleFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".obj, .stl, .fbx, .gltf, .glb, .dae, .vrm";

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

                        const clip = action.getClip();

                        totalTime = clip.duration;
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

                    isPlay = true;
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
				reader.addEventListener( 'load', async function ( event ) {
					const contents = event.target.result;

					const loader = new ColladaLoader( manager );

					const collada = loader.parse( contents );

					collada.scene.name = "mainObject";

                    scene.add(collada.scene);

				}, false );
				reader.readAsText( file );

				break;

            case 'vrm':
				reader.addEventListener( 'load', async function ( event ) {
				    const contents = event.target.result;

					const loader = new GLTFLoader( manager );

					loader.register((parser) => {
                        return new VRMLoaderPlugin(parser);
                    });

					loader.parse( contents, '', function ( result ) {
					    const vrm = result.userData.vrm;

                        currentVRM = vrm;

                        const resultScene = vrm.scene;

						resultScene.name = "mainObject";

                        scaleObjectToProper(resultScene);

                        scene.add(resultScene);
					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

        }
    })
    input.click();

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

function moveLight(x, y, z) {
    directionalLight.position.x = x;
    directionalLight.position.y = y;
    directionalLight.position.z = z;
}

function rotateModel(x, y, z) {
    let object = scene.getObjectByName("mainObject");

    object.rotation.x = Math.PI * x;
    object.rotation.y = Math.PI * y;
    object.rotation.z = Math.PI * z;
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

            let delta = clock3DModel.getDelta();

            if (mixer && isPlay && !controlByProgressBar) {
                currentTime = mixer.time > totalTime? mixer.time - totalTime: mixer.time;

                progress = currentTime / totalTime;

                let progressBar = gradioApp().querySelector('#progress_bar_3dmodel');

                //TODO should update progress bar here
                //progressBar.childNodes[4].value = progress * 100;
            }

            if ((mixer && isPlay) || (mixer && controlByProgressBar)) {
                mixer.update(delta);

                if (!currentVRM) {
                    controlByProgressBar = false;
                }
            }

            if ((currentVRM && isPlay) || (currentVRM && controlByProgressBar)) {
                currentVRM.update( delta );

                controlByProgressBar = false;
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

        const selector = type === "txt2img" ? "#txt2img_script_container" : "#img2img_script_container";

        if (type === "txt2img") {
            switch_to_txt2img();
        } else if (type === "img2img") {
            switch_to_img2img();
        }

        let container = gradioApp().querySelector(selector);

        let element = container.querySelector('#controlnet');

        if (!element) {
            for (const spans of container.querySelectorAll<HTMLSpanElement>(
                '.cursor-pointer > span'
            )) {
                if (!spans.textContent?.includes('ControlNet')) {
                    continue
                }
                if (spans.textContent?.includes('M2M')) {
                    continue
                }
                element = spans.parentElement?.parentElement
            }
            if (!element) {
                console.error('ControlNet element not found')
                return
            }
        }

        const imageElems = element.querySelectorAll('div[data-testid="image"]')

        if (!imageElems[Number(index)]) {
            let accordion = element.querySelector('.icon');

            if (accordion) {
                accordion.click();

                let controlNetAppeared = false;

                let observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            if (mutation.addedNodes[i].tagName === "INPUT") {

                                controlNetAppeared = true;

                                const imageElems2 = element.querySelectorAll('div[data-testid="image"]');

                                updateGradioImage(imageElems2[Number(index)], dt);

                                observer.disconnect();

                                return;
                            }
                        }
                    }
                    });
                });

                observer.observe(element, { childList: true, subtree: true });
            }
        }
        else {
            updateGradioImage(imageElems[Number(index)], dt);
        }
    });
}

function updateGradioImage (element, dt) {
    let clearButton = element.querySelector("button[aria-label='Clear']");

    if (clearButton) {
        clearButton.click();
    }

    const input = element.querySelector("input[type='file']");
    input.value = ''
    input.files = dt.files
    input.dispatchEvent(
        new Event('change', {
            bubbles: true,
            composed: true,
        })
    )
}

export {
    init_3d, setAxisVisible, setGroundVisible, setGridVisible, setBGColor, setGroundColor, setCanvasSize,
    uploadFile, setLightColor, moveLight, updateModel, restCanvasAndCamera, sendImage,
    playAndPause, stop, setMultiFiles, setEntryType, rotateModel, setCurrentAnimationTime, poseRotateNeck,
    poseRotateLeftUpperArm, poseRotateRightUpperArm, poseRotateLeftLowerArm, poseRotateRightLowerArm,
    poseRotateLeftUpperLeg, poseRotateRightUpperLeg, poseRotateLeftLowerLeg, poseRotateRightLowerLeg,
    poseRotateLeftHand, poseRotateRightHand, poseRotateLeftFoot, poseRotateRightFoot, poseRotateSpine,
    loadPoseFile, savePoseAsJson, loadPoseFromJson
};