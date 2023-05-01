import React, {useRef, useEffect} from 'react';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ColladaLoader} from 'three/addons/loaders/ColladaLoader.js';
import {VRMLoaderPlugin} from "@pixiv/three-vrm";
import {setAnimationProgress} from './AnimationPanel'

let _playing = true;
let _renderer;
let _container;
let _camera;
let _groundMesh;
let _groundGrid;
let _axis;
let _action;
let _mixer;
let _totalTime;
let _currentTime;
let _progress;
let _controlByProgressBar;
let _secondCamera;
let _scene;

const previewWidth = 300;
const previewHeight = 300;

let _width;
let _height;
let _transformControls;
let _orbitController;
let _selectedObject;
let _transformControlsMode = "none";

export function setTransformControlsMode(modeEvent) {
    _transformControlsMode = modeEvent.target.value;

    if (_transformControlsMode !== "none") {
        _transformControls.setMode(_transformControlsMode);

        _transformControls.attach(_selectedObject);
    } else {
        _transformControls.detach();
    }
}

export function refreshSceneTree() {
    window.updateObjects(convertThreeJsObjects());
}

export function handleSelectedObject(object) {
    const objName = object.target.innerHTML;

    if (objName !== "Scene" && _transformControlsMode !== "none") {
        _selectedObject = _scene.getObjectByName(objName);

        _transformControls.setMode(_transformControlsMode);

        _transformControls.attach(_selectedObject);
    }
}

export function setFar(far) {
    _camera.far = far;
    _camera.updateProjectionMatrix();
    _secondCamera.far = far;
    _secondCamera.updateProjectionMatrix();
}

export function setNear(near) {
    _camera.near = near;
    _camera.updateProjectionMatrix();
    _secondCamera.near = near;
    _secondCamera.updateProjectionMatrix();
}

export function setFOV(fov) {
    _camera.fov = fov;
    _camera.updateProjectionMatrix();
    _secondCamera.fov = fov;
    _secondCamera.updateProjectionMatrix();
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
    if ((div.offsetWidth > 0) && (div.offsetHeight > 0)) {
        return true;
    }

    return false;
}

function ThreeJsScene({onSceneInitialized, uploadedModelFile}) {
    const containerRef = useRef();
    const managerRef = useRef();
    const sceneRef = useRef();

    useEffect(() => {
        _container = containerRef.current;

        _renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true,});

        _renderer.domElement.style.width = '100%';
        _renderer.domElement.style.height = '100%';

        _container.appendChild(_renderer.domElement);

        observer.observe(_container);

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

        const groundMaterial = new THREE.MeshBasicMaterial({color: 0xbebebe});

        _groundMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), groundMaterial);

        _groundMesh.name = "Ground";
        _groundMesh.rotation.x = -Math.PI / 2;
        _groundMesh.receiveShadow = true;

        _scene.add(_groundMesh);

        _groundGrid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);

        _groundGrid.name = "Grid";
        _groundGrid.material.opacity = 0.2;
        _groundGrid.material.transparent = true;

        _scene.add(_groundGrid);

        _axis = new THREE.AxesHelper(2000);

        _axis.name = "Axis";

        _scene.add(_axis);

        _orbitController = new OrbitControls(_camera, _renderer.domElement);

        _orbitController.mouseButtons = {LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.PAN};

        const clock = new THREE.Clock();

        _secondCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

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
        });

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

                    _controlByProgressBar = false;
                }

                _renderer.setViewport(0, 0, _container.clientWidth, _container.clientHeight);
                _renderer.setScissor(0, 0, _container.clientWidth, _container.clientHeight);
                _renderer.setScissorTest(true);
                _camera.updateProjectionMatrix();

                _renderer.render(_scene, _camera);

                orbitController2.update()

                _renderer.setViewport(0, 0, previewWidth, previewHeight);
                _renderer.setScissor(0, 0, previewWidth, previewHeight);
                _renderer.setScissorTest(true);
                _secondCamera.updateProjectionMatrix();

                _renderer.render(_scene, _secondCamera);
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

    function removeMainObject() {
        //const scene = scene;

        const object = _scene.getObjectByName("mainObject");

        if (object) {
            _scene.remove(object);

            _transformControls.detach();
        }

        //if (currentVRM) {currentVRM = undefined;}
    }

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

        mainObject.name = "mainObject";

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
        mainObject.name = "mainObject";

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
                _action.play();
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

        mainObject.name = "mainObject";

        scaleObjectToProper(mainObject);

        _scene.add(mainObject);

        window.updateObjects(convertThreeJsObjects());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadGLTF(event) {
        const contents = event.target.result;

        let loader;

        if (isGLTF1(contents)) {
            alert('Import of glTF asset not possible. Only versions >= 2.0 are supported. Please try to upgrade the file to glTF 2.0 using glTF-Pipeline.');
        } else {
            const dracoLoader = new DRACOLoader();
            //dracoLoader.setDecoderPath( '.' );

            loader = new GLTFLoader(managerRef.current);
            loader.setDRACOLoader(dracoLoader);
        }

        loader.parse(contents, '', function (result) {
            const resultScene = result.scene;
            resultScene.name = "mainObject";

            resultScene.animations.push(...result.animations);

            _scene.add(resultScene);

            window.updateObjects(convertThreeJsObjects());
        });
    }

    function loadGLB(event) {
        const contents = event.target.result;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('.');

        const loader = new GLTFLoader();

        loader.setDRACOLoader(dracoLoader);

        loader.parse(contents, '', function (result) {
            const resultScene = result.scene;
            resultScene.name = "mainObject";

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

        collada.scene.name = "mainObject";

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

            //currentVRM = vrm;

            const resultScene = vrm.scene;

            resultScene.name = "mainObject";

            scaleObjectToProper(resultScene);

            _scene.add(resultScene);

            window.updateObjects(convertThreeJsObjects());
        });
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

    useEffect(() => {
        if (uploadedModelFile) {
            const filename = uploadedModelFile.name;
            const extension = filename.split('.').pop().toLowerCase();
            const reader = new FileReader();

            removeMainObject();

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

function traverseScene(scene, callback) {
    scene.traverse((object) => {
        if (object.isObject3D) {
            callback(object);
        }
    });
}

export function convertThreeJsObjects() {
    return _scene.toJSON();
}

export default ThreeJsScene;

export function setBgColor(bgColor) {
    const backgroundColor = new THREE.Color(bgColor.hex);

    _renderer.setClearColor(backgroundColor);
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

export function setVisible(objName, visible) {
    if (_scene) {
        const selectedObject = _scene.getObjectByName(objName);

        selectedObject.visible = visible;
    }
}

export function setShowGround(showGround) {
    _groundMesh.visible = showGround;
}

export function setShowGroundGrid(showGroundGrid) {
    _groundGrid.visible = showGroundGrid;
}

export function setShowAxis(showAxis) {
    _axis.visible = showAxis;
}

export function controlAnimationProgress(e) {
    if (_action && !_playing) {
        _currentTime = e / 100 * _totalTime;

        _action.time = _currentTime;
        _mixer.time = _currentTime;

        _controlByProgressBar = true;
    }
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