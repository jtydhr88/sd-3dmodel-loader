var scene;
var camera;
var mixer;
var action;
var isPlay;
var renderer;
var axes;
var groundMesh;
var groundGrid;
var webGLOutputDiv;
var mainObject;

function updateModel(modelScalePage) {
    var object = scene.getObjectByName("mainObject");

    var modelScale = Number(modelScalePage);

    if (object) {
        object.scale.set(modelScale, modelScale, modelScale);
    }
}

function setCanvasPage(haGroundPage, hasAxisPage, widthPage, heightPage, colorPage) {
    setBGColor(colorPage);
    setCanvasSize(widthPage, heightPage);
    setAxisVisible(hasAxisPage);
    setGroundVisible(haGroundPage);
}

function setGroundVisible(haGround) {
    groundMesh.visible = haGround;
}

function setGroundGridVisible(haGround) {
    groundGrid.visible = haGround;
}

function setAxisVisible(hasAxis) {
    axes.visible = hasAxis;
}

function setCanvasSize(width, height) {
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    webGLOutputDiv.setAttribute("style", `width: ${width + 2}px; height: ${height + 2}px; border: 0.5px solid;`);
}

function setBGColor(gColor) {
    renderer.setClearColor(new THREE.Color(gColor));
}

function setGroundColor(gColor) {
    groundMesh.material.color = new THREE.Color(gColor);
}

function playAndPause() {
    if (isPlay) {
        isPlay = false;
    }
    else {
        if (action) {
            action.play();
        }

        isPlay = true;
    }
}

function stop() {
    if (action) {
        action.stop();
    }

    isPlay = false;
}

function removeMainObject() {
    var object = scene.getObjectByName("mainObject");

    if (object) {
        scene.remove(object);
    }
}

function uploadFile() {
    const input = document.createElement("input");
    input.type = "file"
    input.accept = ".obj, .stl, .fbx"
    input.addEventListener("change", function(e){
        const file = e.target.files[0];

        var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var reader = new FileReader();

        var manager = new THREE.LoadingManager();

        removeMainObject();

        switch ( extension ) {
            case 'obj':
                reader.addEventListener( 'load', function ( event ) {
					var contents = event.target.result;

					mainObject = new THREE.OBJLoader().parse( contents );
					mainObject.name = "mainObject";

					scene.add(mainObject);

				}, false );
				reader.readAsText( file );

                break;
            case 'stl':
                reader.addEventListener( 'load', function ( event ) {
                    var contents = event.target.result;

                    var geometry = new THREE.STLLoader().parse( contents );

                    geometry.sourceType = "stl";
                    geometry.sourceFile = file.name;

					var material = new THREE.MeshStandardMaterial();

					mainObject = new THREE.Mesh( geometry, material );
					mainObject.name = "mainObject";

					scene.add(mainObject);

				}, false );

				if ( reader.readAsBinaryString !== undefined ) {
					reader.readAsBinaryString( file );

				}
				else {
					reader.readAsArrayBuffer( file );
				}

				break;

            case 'fbx':
                reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var loader = new THREE.FBXLoader( manager );
					mainObject = loader.parse( contents );

					mixer = new THREE.AnimationMixer( mainObject );

                    if (mainObject.animations[0]) {
                        action = mixer.clipAction( mainObject.animations[ 0 ] );

                        action.play();
                    }

                    mainObject.traverse( function ( child ) {
						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;

						}

					} );

					mainObject.name = "mainObject";

                    scene.add( mainObject );

				}, false );

				reader.readAsArrayBuffer( file );

				break;
        }
    })

    input.click();

    isPlay = true;
}

function restCanvasAndCamera() {
    restCanvas();
    resetCamera();
}

function restCanvas() {
    removeMainObject();
}

function resetCamera() {
    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;

    camera.lookAt(scene.position);
}

function initWebGLOutput(webGLOutputDiv) {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    var clock = new THREE.Clock();

    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );

    var width = webGLOutputDiv.getAttribute("canvas_width");
    var height = webGLOutputDiv.getAttribute("canvas_height");

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    resetCamera();

    var orbit = new THREE.OrbitControls(camera);

    orbit.enabled = false;

    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true
    });

    var bgColor = webGLOutputDiv.getAttribute("canvas_bg_color");

    renderer.setClearColor(new THREE.Color(bgColor));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    var hasAxis = webGLOutputDiv.getAttribute("has_axis");

    axes = new THREE.AxesHelper(2000);
    scene.add(axes);

    if (hasAxis == 'True') {
        axes.visible = true;
    }
    else {
        axes.visible = false;
    }

    groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xEEEEEE, depthWrite: false } ) );

    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.receiveShadow = true;

    scene.add( groundMesh );

    groundGrid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );

    groundGrid.material.opacity = 0.2;
    groundGrid.material.transparent = true;

    scene.add( groundGrid );

    var hasGround = webGLOutputDiv.getAttribute("has_ground");

    if (hasGround == 'True') {
        groundMesh.visible = true;
        groundGrid.visible = true;
    }
    else {
        groundMesh.visible = false;
        groundGrid.visible = false;
    }

    webGLOutputDiv.appendChild(renderer.domElement);

    webGLOutputDiv.addEventListener(
        "mouseenter",
        (event) => {
            orbit.enabled = true;
        },
        false
    );

    webGLOutputDiv.addEventListener(
        "mouseleave",
        (event) => {
            orbit.enabled = false;
        },
        false
    );

    isPlay = true;

    render();

    function render() {
        orbit.update();

        requestAnimationFrame(render);

        var delta = clock.getDelta();

        if (mixer && isPlay) {
            mixer.update(delta);
        }

        renderer.render(scene, camera);
    }
}

function sendImage(type, index){
    renderer.domElement.toBlob((blob) => {
        const file = new File([blob], "pose.png")

        const dt = new DataTransfer();

        dt.items.add(file);

        const list = dt.files

        const selector = type === "txt2img" ? "#txt2img_script_container" : "#img2img_script_container"

        if (type === "txt2img"){
            switch_to_txt2img()
        }
        else if(type === "img2img"){
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
        const event = new Event('change', { 'bubbles': true, "composed": true });
        input.dispatchEvent(event);
    });
}

let executed_webGL_output = false;

window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((m) => {
        if(!executed_webGL_output && gradioApp().querySelector('#WebGL-output')){
            executed_webGL_output = true;

            webGLOutputDiv = gradioApp().querySelector('#WebGL-output');

            initWebGLOutput(webGLOutputDiv)

            observer.disconnect();
        }
    });

    observer.observe(gradioApp(), { childList: true, subtree: true });
})