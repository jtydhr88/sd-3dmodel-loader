import React, {useRef, useEffect} from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader.js';
import {VRMLoaderPlugin, VRMUtils} from "@pixiv/three-vrm";
import {setAnimationProgress} from './AnimationPanel'
import {vertexShader, fragmentShader} from './shaders';

let _playing = true;
let _action;

let _renderer;
let _container;
export let _camera;
let _groundMesh;
let _groundGrid;
let _axis;
let _mixer;
let _totalTime;
let _currentTime;
let _progress;
let _controlByProgressBar;
export let _secondCamera;
let _scene;
let previewWidth = 300;
let previewHeight = 300;

let _width;
let _height;
let _transformControls;
let _orbitController;
let _selectedObject;
let _currentVRM;

let _mainObjectCounter = 1;

let _renderMode = "none";
let _operateMode = "none";

let _handModel;
let _bodyModel;

let _handBoneMeshes = [];
let _bodyBoneMeshes = [];

let _isDragging = false;

const transformControlObjNames = ["mainObject", "Hemisphere Light", "Directional Light"];

export function showHandBones(visible) {
    if (_handBoneMeshes) {
        for (let bone of _handBoneMeshes) {
            bone.visible = visible;
        }
    }
}

export function showBodyBones(visible) {
    if (_bodyBoneMeshes) {
        for (let bone of _bodyBoneMeshes) {
            bone.visible = visible;
        }
    }
}

export function setPreviewSize(previewSize) {
    if (previewSize === "1:1") {
        previewWidth = 300;
        previewHeight = 300;
    } else if (previewSize === "2:3") {
        previewWidth = 300;
        previewHeight = 450;
    } else if (previewSize === "3:2") {
        previewWidth = 450;
        previewHeight = 300;
    }
}

export function removeObject(objName) {
    const object = _scene.getObjectByName(objName);

    if (object) {
        _scene.remove(object);

        _transformControls.detach();
    }

    if (_currentVRM && _currentVRM.scene.name === objName) {
        _currentVRM = undefined;
    }

    if (objName === "hand model") {
        _handModel = undefined;
        _handBoneMeshes = [];
    }

    if (objName === "body model") {
        _bodyModel = undefined;
        _bodyBoneMeshes = [];
    }
}

export function handlePoseSelectedObject(objName, transformControlsMode) {
    if (transformControlsMode && transformControlsMode !== "none") {
        if (_currentVRM) {
            const boneNode = _currentVRM.humanoid.getNormalizedBoneNode(objName);

            if (boneNode) {
                _transformControls.setMode(transformControlsMode);
                _transformControls.attach(boneNode);
            }
        }
    } else {
        _transformControls.detach();
    }
}

export function handleSelectedObject(objName) {
    if (objName && transformControlObjNames.some(sub => objName.includes(sub))) {
        _selectedObject = _scene.getObjectByName(objName);

        if (_operateMode !== "none") {
            _transformControls.setMode(_operateMode);

            _transformControls.attach(_selectedObject);
        } else {
            _transformControls.detach();
        }
    }
}

export function refreshSceneTree() {
    window.updateObjects(convertThreeJsObjects());
}

const normalMaterial = new THREE.MeshNormalMaterial();

const originalMaterials = {};

export function setOperateMode(operateMode) {
    _operateMode = operateMode;

    if (_operateMode === "none") {
        _transformControls.detach();
    } else if (_currentSelected) {
        const boneName = _currentSelected.userData.boneName;

        let boneNode;

        if (_handModel) {
            boneNode = _handModel.getObjectByName(boneName);

        } else if (_bodyModel) {
            boneNode = _bodyModel.getObjectByName(boneName);
        }

        if (boneNode) {
            _transformControls.setMode(_operateMode);
            _transformControls.attach(boneNode);
        }
    } else if (_selectedObject) {
        _transformControls.setMode(_operateMode);

        _transformControls.attach(_selectedObject);
    }
}

export function setRenderMode(renderMode) {
    _renderMode = renderMode;

    if (_scene) {
        if (isRenderNone()) {
            _scene.add(_transformControls);
        } else {
            _scene.remove(_transformControls);
        }

        if (_renderMode === "normal") {
            _scene.traverse((node) => {
                if (node.isMesh) {
                    originalMaterials[node.id] = node.material;

                    node.material = normalMaterial;
                }
            });
        } else {
            _scene.traverse((node) => {
                if (node.isMesh && originalMaterials[node.id]) {
                    node.material = originalMaterials[node.id];
                }
            });

            if (_transformControls) {
                _scene.add(_transformControls);
            }
        }
    }
}

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            onWindowResize();
        }
    });
});

const onWindowResize = () => {
    _width = _container.clientWidth;
    _height = _container.clientHeight;

    _camera.aspect = _width / _height;
    _camera.updateProjectionMatrix();

    _renderer.setSize(_width, _height);
};

function checkDivVisible(div) {
    return (div.offsetWidth > 0) && (div.offsetHeight > 0);
}

function isRenderDepth() {
    return _renderMode === "depth";
}

function isRenderNone() {
    return _renderMode === "none";
}

let depthTarget;
let depthPostScene, depthPostCamera, depthPostPreviewCamera, depthPostMaterial;

function setupRenderTarget() {
    if (depthTarget) {
        depthTarget.dispose();
    }

    depthTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    depthTarget.texture.minFilter = THREE.NearestFilter;
    depthTarget.texture.magFilter = THREE.NearestFilter;
    depthTarget.stencilBuffer = false;
    depthTarget.depthTexture = new THREE.DepthTexture();
    depthTarget.depthTexture.format = THREE.DepthFormat;
    depthTarget.depthTexture.type = parseFloat(THREE.UnsignedShortType);
}

export function setDepthContrast(contrast) {
    if (depthPostMaterial) {
        depthPostMaterial.uniforms.contrast.value = 1 - contrast;
    }
}

function setupPost() {
    depthPostCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    depthPostPreviewCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    depthPostMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            cameraNear: {value: _camera.near},
            cameraFar: {value: _camera.far},
            tDiffuse: {value: null},
            tDepth: {value: null},
            contrast: {value: 0.2}
        }
    });
    const postPlane = new THREE.PlaneGeometry(2, 2);
    const postQuad = new THREE.Mesh(postPlane, depthPostMaterial);
    depthPostScene = new THREE.Scene();
    depthPostScene.add(postQuad);
}

function ThreeJsScene({configs, uploadedModelFile}) {
    const containerRef = useRef();
    const managerRef = useRef();
    const sceneRef = useRef();

    useEffect(() => {
        _container = containerRef.current;

        _renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true,});

        _renderer.setClearColor(configs.defaultBGColor);

        _renderer.domElement.style.width = '100%';
        _renderer.domElement.style.height = '100%';

        _container.appendChild(_renderer.domElement);

        observer.observe(_container);

        setupRenderTarget();

        _scene = new THREE.Scene();
        _scene.name = "Scene";

        sceneRef.current = _scene;

        _width = _container.clientWidth;
        _height = _container.clientHeight;

        managerRef.current = new THREE.LoadingManager();

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);

        hemisphereLight.name = "Hemisphere Light";
        hemisphereLight.position.set(0, 200, 0);

        _scene.add(hemisphereLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff);

        directionalLight.name = "Directional Light";
        directionalLight.position.set(0, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.top = 180;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.camera.left = -120;
        directionalLight.shadow.camera.right = 120;

        _scene.add(directionalLight);

        _camera = new THREE.PerspectiveCamera(45, _width / _height, 0.1, 1000);

        _camera.position.x = -30;
        _camera.position.y = 40;
        _camera.position.z = 30;

        _camera.lookAt(_scene.position);

        _renderer.setSize(_width, _height);

        const groundMaterial = new THREE.MeshBasicMaterial({color: configs.defaultGroundColor});

        _groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), groundMaterial);

        _groundMesh.name = "Ground";
        _groundMesh.rotation.x = -Math.PI / 2;
        _groundMesh.receiveShadow = true;
        _groundMesh.visible = configs.defaultShowGround;

        _scene.add(_groundMesh);

        _groundGrid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);

        _groundGrid.name = "Grid";
        _groundGrid.material.opacity = 0.2;
        _groundGrid.material.transparent = true;
        _groundGrid.visible = configs.defaultShowGird;

        _scene.add(_groundGrid);

        _axis = new THREE.AxesHelper(2000);

        _axis.name = "Axis";
        _axis.visible = configs.defaultShowAxis;

        _scene.add(_axis);

        _orbitController = new OrbitControls(_camera, _renderer.domElement);

        _orbitController.mouseButtons = {LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN};

        const clock = new THREE.Clock();

        _secondCamera = new THREE.PerspectiveCamera(45, previewWidth / previewHeight, 0.1, 1000);

        _secondCamera.name = "Preview Camera";

        _secondCamera.position.copy(_camera.position);

        _secondCamera.quaternion.copy(_camera.quaternion);

        const orbitController2 = new OrbitControls(_secondCamera, _renderer.domElement);
        orbitController2.mouseButtons = {LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN};
        _scene.add(_secondCamera);

        _transformControls = new TransformControls(_camera, _renderer.domElement);

        _transformControls.name = "Transform Controls";

        _transformControls.addEventListener('dragging-changed', (event) => {
            _orbitController.enabled = !event.value;
            orbitController2.enabled = !event.value;

            _isDragging = event.value;
        });

        _transformControls.space = 'local';

        setupPost();

        _scene.add(_transformControls);

        const animate = () => {
            requestAnimationFrame(animate);

            if (checkDivVisible(_container)) {
                _orbitController.update();

                let delta = clock.getDelta();

                if (_mixer && _playing) {
                    _currentTime = _mixer.time % _totalTime;

                    _progress = ((_currentTime / _totalTime) * 100).toFixed(1);

                    setAnimationProgress(_progress);
                }

                if (_mixer && (_playing || _controlByProgressBar)) {
                    _mixer.update(delta);

                    if (!_currentVRM) {
                        _controlByProgressBar = false;
                    }
                }

                if ((_currentVRM && _playing) || (_currentVRM && _controlByProgressBar)) {
                    _currentVRM.update(delta);

                    _controlByProgressBar = false;
                }

                _renderer.setViewport(0, 0, _container.clientWidth, _container.clientHeight);
                _renderer.setScissor(0, 0, _container.clientWidth, _container.clientHeight);
                _renderer.setScissorTest(true);
                _camera.updateProjectionMatrix();

                if (isRenderDepth()) {
                    _renderer.setRenderTarget(depthTarget);
                }

                _renderer.render(_scene, _camera);

                if (isRenderDepth()) {
                    depthPostMaterial.uniforms.tDiffuse.value = depthTarget.texture;
                    depthPostMaterial.uniforms.tDepth.value = depthTarget.depthTexture;

                    _renderer.setRenderTarget(null);
                    _renderer.render(depthPostScene, depthPostCamera);
                }

                orbitController2.update()

                _renderer.setViewport(0, 0, previewWidth, previewHeight);
                _renderer.setScissor(0, 0, previewWidth, previewHeight);
                _renderer.setScissorTest(true);

                if (isRenderDepth()) {
                    _renderer.setRenderTarget(depthTarget);
                }

                _secondCamera.aspect = previewWidth / previewHeight;
                _secondCamera.updateProjectionMatrix();

                _renderer.render(_scene, _secondCamera);

                if (isRenderDepth()) {
                    depthPostMaterial.uniforms.tDiffuse.value = depthTarget.texture;
                    depthPostMaterial.uniforms.tDepth.value = depthTarget.depthTexture;

                    _renderer.setRenderTarget(null);
                    _renderer.render(depthPostScene, depthPostCamera);
                }

                if (_handBoneMeshes) {
                    for (let boneMesh of _handBoneMeshes) {
                        let worldPos = new THREE.Vector3();

                        boneMesh.userData.boneRef.getWorldPosition(worldPos);
                        boneMesh.position.copy(worldPos);
                    }
                }

                if (_bodyBoneMeshes) {
                    for (let boneMesh of _bodyBoneMeshes) {
                        let worldPos = new THREE.Vector3();

                        boneMesh.userData.boneRef.getWorldPosition(worldPos);
                        boneMesh.position.copy(worldPos);
                    }
                }
            }
        };

        if (window.updateObjects) {
            window.updateObjects(convertThreeJsObjects());
        }

        window.addEventListener('resize', onWindowResize);

        animate();

        return () => {
            // 组件卸载时的清理操作
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);

    function isGLTF1(contents) {
        let resultContent;

        if (typeof contents === 'string') {
            resultContent = contents;
        } else {
            const magic = THREE.LoaderUtils.decodeText(new Uint8Array(contents, 0, 4));

            if (magic === 'glTF') {
                const version = new DataView(contents).getUint32(4, true);

                return version < 2;

            } else {
                resultContent = THREE.LoaderUtils.decodeText(new Uint8Array(contents));
            }
        }

        const json = JSON.parse(resultContent);

        return (json.asset !== undefined && json.asset.version[0] < 2);
    }

    function loadOBJ(event) {
        const contents = event.target.result;

        const mainObject = new OBJLoader().parse(contents);

        mainObject.name = "mainObject" + _mainObjectCounter.toString();

        _mainObjectCounter++;

        scaleObjectToProper(mainObject);

        _scene.add(mainObject);

        window.updateObjects(convertThreeJsObjects());
    }

    function loadSTL(event) {
        const contents = event.target.result;
        const geometry = new STLLoader().parse(contents);
        const material = new THREE.MeshStandardMaterial();

        geometry.sourceType = "stl";
        //geometry.sourceFile = file.name;

        const mainObject = new THREE.Mesh(geometry, material);

        mainObject.name = "mainObject" + _mainObjectCounter.toString();

        _mainObjectCounter++;

        scaleObjectToProper(mainObject);

        _scene.add(mainObject);

        window.updateObjects(convertThreeJsObjects());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadFBX(event) {
        const contents = event.target.result;
        const loader = new FBXLoader(managerRef.current);
        const mainObject = loader.parse(contents);
        _mixer = new THREE.AnimationMixer(mainObject);

        if (mainObject.animations[0]) {
            _action = _mixer.clipAction(mainObject.animations[0]);

            if (_playing) {
                //_action.play();
            }

            const clip = _action.getClip();

            _totalTime = clip.duration;
        }

        mainObject.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mainObject.name = "mainObject" + _mainObjectCounter.toString();

        _mainObjectCounter++;

        scaleObjectToProper(mainObject);

        _scene.add(mainObject);

        window.updateObjects(convertThreeJsObjects());
    }

    function loadGLTF(event) {
        const contents = event.target.result;

        let loader;

        if (isGLTF1(contents)) {
            alert('Import of glTF asset not possible. Only versions >= 2.0 are supported. Please try to upgrade the file to glTF 2.0 using glTF-Pipeline.');
        } else {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/file=extensions/sd-3dmodel-loader/js/');

            loader = new GLTFLoader(managerRef.current);
            loader.setDRACOLoader(dracoLoader);
        }

        loader.parse(contents, '', function (result) {
            const resultScene = result.scene;
            resultScene.name = "mainObject" + _mainObjectCounter.toString();

            _mainObjectCounter++;

            resultScene.animations.push(...result.animations);

            _scene.add(resultScene);

            window.updateObjects(convertThreeJsObjects());
        });
    }

    function loadGLB(event) {
        const contents = event.target.result;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/file=extensions/sd-3dmodel-loader/js/');

        const loader = new GLTFLoader();

        loader.setDRACOLoader(dracoLoader);

        loader.parse(contents, '', function (result) {
            const resultScene = result.scene;
            resultScene.name = "mainObject" + _mainObjectCounter.toString();

            _mainObjectCounter++;

            resultScene.animations.push(...result.animations);

            _scene.add(resultScene);

            window.updateObjects(convertThreeJsObjects());
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadDAE(event) {
        const contents = event.target.result;

        const loader = new ColladaLoader(managerRef.current);

        const collada = loader.parse(contents);

        collada.scene.name = "mainObject" + _mainObjectCounter.toString();

        _mainObjectCounter++;

        _scene.add(collada.scene);

        window.updateObjects(convertThreeJsObjects());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadVRM(event) {
        const contents = event.target.result;

        const loader = new GLTFLoader(managerRef.current);

        loader.register((parser) => {
            return new VRMLoaderPlugin(parser);
        });

        loader.parse(contents, '', function (result) {
            const vrm = result.userData.vrm;

            if (!_currentVRM) {
                _currentVRM = vrm;
            }

            const resultScene = vrm.scene;

            resultScene.name = "mainObject" + _mainObjectCounter.toString();

            _mainObjectCounter++;

            scaleObjectToProper(resultScene);

            _scene.add(resultScene);

            window.updateObjects(convertThreeJsObjects());
        });
    }


    useEffect(() => {
        if (uploadedModelFile) {
            const filename = uploadedModelFile.name;
            const extension = filename.split('.').pop().toLowerCase();
            const reader = new FileReader();

            //removeMainObject();

            switch (extension) {
                case 'obj':
                    reader.addEventListener('load', loadOBJ, false);

                    reader.readAsText(uploadedModelFile);

                    break;
                case 'stl':
                    reader.addEventListener('load', loadSTL, false);

                    if (reader.readAsBinaryString !== undefined) {
                        reader.readAsBinaryString(uploadedModelFile);
                    } else {
                        reader.readAsArrayBuffer(uploadedModelFile);
                    }

                    break;
                case 'fbx':
                    reader.addEventListener('load', loadFBX, false);
                    reader.readAsArrayBuffer(uploadedModelFile);
                    break;
                case 'gltf':
                    reader.addEventListener('load', loadGLTF, false);
                    reader.readAsArrayBuffer(uploadedModelFile);
                    break;
                case 'glb':
                    reader.addEventListener('load', loadGLB, false);

                    reader.readAsArrayBuffer(uploadedModelFile);

                    break;
                case 'dae':
                    reader.addEventListener('load', loadDAE, false);

                    reader.readAsText(uploadedModelFile);

                    break;
                case 'vrm':
                    reader.addEventListener('load', loadVRM, false);

                    reader.readAsArrayBuffer(uploadedModelFile);

                    break;
            }


        }

    }, [uploadedModelFile, loadOBJ, loadSTL, loadFBX, loadGLTF, loadDAE, loadVRM]);

    return (
        <div ref={containerRef} style={{width: '100%', height: '100%'}}></div>
    );
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

let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

window.addEventListener('mousedown', onBonePickupMouseDown, false);

function onBonePickupMouseDown(event) {
    if (event.button !== 0) {
        return;
    }

    let rect = _container.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    checkForBoneIntersection();
}

let _hoveredMesh;
let _hoveredMeshOriginalColor;

let _previousSelected;
let _currentSelected;
let _selectedMeshOriginalColor;

function checkForBoneIntersection() {
    if (!(_handModel || _bodyModel) || _isDragging) {
        return;
    }

    raycaster.setFromCamera(mouse, _camera);

    let intersectObjects;
    let tag;

    if (_handModel) {
        intersectObjects = _handModel.children;
        tag = "handBone";
    } else if (_bodyModel) {
        intersectObjects = _bodyModel.children;
        tag = "bodyBone";
    }

    let intersects = raycaster.intersectObjects(intersectObjects, true);

    let closestBoneMesh = null;
    let closestDistance = Infinity;

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData && intersects[i].object.userData.tag === tag) {
            if (intersects[i].distance < closestDistance) {
                closestDistance = intersects[i].distance;
                closestBoneMesh = intersects[i].object;
            }
        }
    }

    if (closestBoneMesh) {
        if (closestBoneMesh === _hoveredMesh) {
            closestBoneMesh.material.color.copy(_hoveredMeshOriginalColor);
        }

        if (_currentSelected && _previousSelected) {
            _currentSelected.material.color.copy(_selectedMeshOriginalColor);
        }

        _selectedMeshOriginalColor = closestBoneMesh.material.color.clone();

        _previousSelected = {
            mesh: closestBoneMesh
        };

        closestBoneMesh.material.color.set("#00008B");
        _currentSelected = closestBoneMesh;

        const boneName = closestBoneMesh.userData.boneName;

        let boneNode;

        if (_handModel) {
            boneNode = _handModel.getObjectByName(boneName);
        } else if (_bodyModel) {
            boneNode = _bodyModel.getObjectByName(boneName);
        }

        if (boneNode && _operateMode !== "none") {
            _transformControls.setMode(_operateMode);
            _transformControls.attach(boneNode);
        }
    }
}

window.addEventListener('mousemove', onBoneHover, false);

function onBoneHover(event) {
    if (!_container) {
        return;
    }

    let rect = _container.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    checkForBoneHover();
}

function checkForBoneHover() {
    if (!(_handModel || _bodyModel) || _isDragging) {
        return;
    }

    raycaster.setFromCamera(mouse, _camera);

    let intersectObjects;
    let tag;

    if (_handModel) {
        intersectObjects = _handModel.children;
        tag = "handBone";
    } else if (_bodyModel) {
        intersectObjects = _bodyModel.children;
        tag = "bodyBone";
    }

    let intersects = raycaster.intersectObjects(intersectObjects, true);

    let closestHoveredMesh = null;

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData && intersects[i].object.userData.tag === tag) {
            closestHoveredMesh = intersects[i].object;
            break;
        }
    }

    if (_hoveredMesh && _hoveredMeshOriginalColor) {
        if (_hoveredMesh !== _currentSelected) {
            _hoveredMesh.material.color.copy(_hoveredMeshOriginalColor);
        }
        _hoveredMesh = null;
        _hoveredMeshOriginalColor = null;
    }

    if (closestHoveredMesh) {

        if (closestHoveredMesh !== _currentSelected) {
            _hoveredMeshOriginalColor = closestHoveredMesh.material.color.clone();
            closestHoveredMesh.material.color.set("red");

            _hoveredMesh = closestHoveredMesh;
        }
    }
}

let existingCoordinates = [];

function hasCoordinate(coordArray, coord) {
    return coordArray.some(existing =>
        existing.x === coord.x &&
        existing.y === coord.y &&
        existing.z === coord.z
    );
}

export function loadPoseModel(resourcePath, poseModelFileName) {
    let manager = new THREE.LoadingManager();

    let path = resourcePath + poseModelFileName;

    const isHand = poseModelFileName.includes("hand")

    if (isHand) {
        if (_handModel && _scene.getObjectByName("hand model")) {
            alert("Right now only support load one hand model.");
            return;
        } else if (_bodyModel && _scene.getObjectByName("body model")) {
            alert("Do not allow to allow hand and body at the same time.");
            return;
        }
    } else {
        if (_bodyModel && _scene.getObjectByName("body model")) {
            alert("Right now only support load one body model.");
            return;
        } else if (_handModel && _scene.getObjectByName("hand model")) {
            alert("Do not allow to allow hand and body at the same time.");
            return;
        }
    }

    const loader = new FBXLoader(manager);

    loader.load(path, (object) => {
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        let targetModel;
        let boneRadius;
        let tag;
        let excludedSubstrings = [];

        if (isHand) {
            object.name = "hand model";
            _handModel = object;
            targetModel = _handModel;
            boneRadius = 0.7;
            tag = "handBone";
            excludedSubstrings = ["end"];
        } else {
            object.name = "body model";
            _bodyModel = object;
            targetModel = _bodyModel;
            boneRadius = 1.5;
            tag = "bodyBone";
            excludedSubstrings = ["Bow", "End", "eye", "Middle", "Ring", "Index", "Thumb", "Pinky"];
        }

        _scene.add(targetModel);

        let boneGeometry = new THREE.SphereGeometry(boneRadius);

        targetModel.traverse(object => {
            if (object instanceof THREE.Bone && !excludedSubstrings.some(sub => object.name.includes(sub))) {
                let randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
                let boneMaterial = new THREE.MeshBasicMaterial({color: "#CCCCCC", depthTest: false});
                let boneMesh = new THREE.Mesh(boneGeometry, boneMaterial);

                let worldPosition = new THREE.Vector3();
                object.getWorldPosition(worldPosition);

                if (hasCoordinate(existingCoordinates, worldPosition)) {
                    return;
                }

                existingCoordinates.push(worldPosition.clone());

                boneMesh.position.copy(worldPosition);

                boneMesh.userData.boneName = object.name;
                boneMesh.userData.boneRef = object;
                boneMesh.userData.tag = tag;

                if (isHand) {
                    _handBoneMeshes.push(boneMesh);
                } else {
                    _bodyBoneMeshes.push(boneMesh);
                }

                targetModel.add(boneMesh);

            }
        });

        existingCoordinates = [];

        window.updateObjects(convertThreeJsObjects());
    });
}

export function importBonesJSON(type, loadedBoneData) {
    if (type === "hand") {
        if (!_handModel) {
            alert("No hand model imported.");
            return;
        }
    } else if (type === "body") {
        if (!_bodyModel) {
            alert("No body model imported.");
            return;
        }
    }

    let targetModel;

    if (type === "hand") {
        targetModel = _handModel;
    } else if (type === "body") {
        targetModel = _bodyModel;
    }

    for (let boneName in loadedBoneData) {
        let bone = targetModel.getObjectByName(boneName);

        if (bone && bone.isBone) {
            if (loadedBoneData[boneName].rotation) {
                bone.rotation.fromArray(loadedBoneData[boneName].rotation);
            }
            if (loadedBoneData[boneName].position) {
                bone.position.fromArray(loadedBoneData[boneName].position);
            }
        }
    }

    targetModel.updateMatrixWorld(true);
}

export function exportBonesJSON(type) {
    if (type === "hand") {
        if (!_handModel) {
            alert("No hand model imported.");
            return;
        }
    } else if (type === "body") {
        if (!_bodyModel) {
            alert("No body model imported.");
            return;
        }
    }

    let targetModel;

    if (type === "hand") {
        targetModel = _handModel;
    } else if (type === "body") {
        targetModel = _bodyModel;
    }

    let boneData = {};

    targetModel.traverse(function (child) {
        if (child.isBone) {
            boneData[child.name] = {
                rotation: child.rotation.toArray(),
                position: child.position.toArray()
            };
        }
    });

    let jsonString = JSON.stringify(boneData);

    let blob = new Blob([jsonString], {type: 'text/plain'});
    let url = URL.createObjectURL(blob);

    let fileName;

    if (type === "hand") {
        fileName = "gesture.json";
    } else if (type === "body") {
        fileName = "pose.json";
    }

    let a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
}

export function convertThreeJsObjects() {
    return _scene.toJSON();
}

export default ThreeJsScene;

export function setBgColor(bgColor) {
    const backgroundColor = new THREE.Color(bgColor.hex);

    _renderer.setClearColor(backgroundColor);
}

export function setGroundColor(groundColor) {
    const groundColorHex = new THREE.Color(groundColor.hex);

    _groundMesh.material.color.set(groundColorHex);
}

export function setVisible(objName, visible) {
    if (_scene) {
        const selectedObject = _scene.getObjectByName(objName);

        selectedObject.visible = visible;
    }
}

export function setPlaying() {
    _playing = !_playing;

    if (_action && _playing) {
        _action.play();
    }
}

export function setStopPlaying() {
    if (_action) {
        _action.stop();
    }

    _playing = false;
}

export function controlAnimationProgress(e) {
    if (_action && !_playing) {
        _currentTime = e / 100 * _totalTime;

        _action.time = _currentTime;
        _mixer.time = _currentTime;

        _controlByProgressBar = true;
    }
}

export function sendRendererImageToCanvasEditor() {
    if (!window.sendImageToCanvasEditorDirect) {
        alert("No Canvas Editor extension installed.");

        return;
    }

    _renderer.domElement.toBlob((blob) => {
        const image = new Image();

        image.onload = function () {
            const canvas = document.createElement('canvas');

            const canvas2 = document.createElement('canvas');

            canvas.width = _width;
            canvas.height = _height;

            const ctx = canvas.getContext('2d');

            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, image.height - previewHeight, previewWidth, previewHeight);

            canvas2.width = previewWidth;
            canvas2.height = previewHeight;

            const ctx2 = canvas2.getContext('2d');

            canvas2.width = previewWidth;
            canvas2.height = previewHeight;

            ctx2.putImageData(imageData, 0, 0);

            const dataURL = canvas2.toDataURL();

            const img = document.createElement('img');
            img.src = dataURL;

            window.sendImageToCanvasEditorDirect(img, previewWidth, previewHeight);
        };

        image.src = URL.createObjectURL(blob);
    });
}

export function downloadRendererImage() {
    _renderer.domElement.toBlob((blob) => {
        const image = new Image();

        image.onload = function () {
            const canvas = document.createElement('canvas');

            const canvas2 = document.createElement('canvas');

            canvas.width = _width;
            canvas.height = _height;

            const ctx = canvas.getContext('2d');

            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, image.height - previewHeight, previewWidth, previewHeight);

            canvas2.width = previewWidth;
            canvas2.height = previewHeight;

            const ctx2 = canvas2.getContext('2d');

            canvas2.width = previewWidth;
            canvas2.height = previewHeight;

            ctx2.putImageData(imageData, 0, 0);

            canvas2.toBlob((blob2) => {
                const file = new File([blob2], "pose.png");
                const url = URL.createObjectURL(file); // 将blob转换为URL

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'pose.png';

                document.body.appendChild(a);
                a.click();

                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
        };

        image.src = URL.createObjectURL(blob);
    });
}

export function setRendererImage(sendImage, controlNetIndex, type) {
    if (controlNetIndex !== '') {
        _renderer.domElement.toBlob((blob) => {
            const image = new Image();

            image.onload = function () {
                const canvas = document.createElement('canvas');

                const canvas2 = document.createElement('canvas');

                canvas.width = _width;
                canvas.height = _height;

                const ctx = canvas.getContext('2d');

                ctx.drawImage(image, 0, 0);

                const imageData = ctx.getImageData(0, image.height - previewHeight, previewWidth, previewHeight);

                canvas2.width = previewWidth;
                canvas2.height = previewHeight;

                const ctx2 = canvas2.getContext('2d');

                canvas2.width = previewWidth;
                canvas2.height = previewHeight;

                ctx2.putImageData(imageData, 0, 0);

                canvas2.toBlob((blob2) => {
                    const file = new File([blob2], "pose.png")
                    const dt = new DataTransfer();
                    dt.items.add(file);

                    sendImage(type, controlNetIndex, dt);
                });
            };

            image.src = URL.createObjectURL(blob);
        });
    } else {
        alert('No ControlNet Selected');
    }
}