var scene;
var camera;
var mixer;
var action;
var isPlay;

function play() {
    action.play();
    isPlay = true;
}

function pause() {
    isPlay = false;
}

function stop() {
    action.stop()
}

function uploadFile() {
    const input = document.createElement("input");
    input.type = "file"
    input.addEventListener("change", function(e){
        const file = e.target.files[0];

        var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var reader = new FileReader();

        var manager = new THREE.LoadingManager();

        switch ( extension ) {
            case 'obj':
                reader.addEventListener( 'load', function ( event ) {
					var contents = event.target.result;

					var object = new THREE.OBJLoader().parse( contents );
					object.name = filename;

					scene.add(object);

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

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					scene.add(mesh);

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
					var object = loader.parse( contents );

					 mixer = new THREE.AnimationMixer( object );

                    action = mixer.clipAction( object.animations[ 0 ] );

                    action.play();

                    object.traverse( function ( child ) {
						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;

						}

					} );

                    scene.add( object );

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
    var allChildren = scene.children;

    for (var i = 0; i < allChildren.length; i++) {
        var child = allChildren[i];

        if (!(child instanceof THREE.AmbientLight) &&
            !(child instanceof THREE.DirectionalLight) &&
            !(child instanceof THREE.PerspectiveCamera) &&
            !(child instanceof THREE.OrbitControls) &&
            !(child instanceof THREE.AxesHelper)) {

            scene.remove(child);
        }
    }
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

    //var width = 512;
    //var height = 512;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    resetCamera();

    var orbit = new THREE.OrbitControls(camera);

    orbit.enabled = false;

    var renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
    });

    var bgColor = webGLOutputDiv.getAttribute("canvas_bg_color");

    renderer.setClearColor(new THREE.Color(bgColor));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    var hasAxis = webGLOutputDiv.getAttribute("has_axis");

    if (hasAxis == 'True') {
        var axes = new THREE.AxesHelper(2000);
        scene.add(axes);
    }

    var hasGround = webGLOutputDiv.getAttribute("has_ground");

    if (hasGround == 'True') {
        var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xEEEEEE, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add( mesh );

        var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add( grid );
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

function getWebGLOutputScreenshot(type) {
    var webGLOutputDiv = gradioApp().querySelector('#WebGL-output');

    html2canvas(webGLOutputDiv).then(canvas => {
        sendImage(type, canvas);
    });
}

function sendImage(type, webGLOutputCanvas){
    webGLOutputCanvas.toBlob((blob) => {
        const file = new File(([blob]), "pose.png")

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

        gradioApp().querySelector(selector).querySelectorAll("span.transition").forEach((elem) => {
            const label = elem.previousElementSibling.textContent;

	    if ((label === `ControlNet - ${target_controlnet_index}`) || /\(?ControlNet\)?\s+-\s+\d/i.test(label)
                    || ((target_controlnet_index === 0) && (label.includes("ControlNet") && !label.includes("M2M")))) {
                elem.className.includes("rotate-90") && elem.parentElement.click();
                const input = elem.parentElement.parentElement.querySelector("input[type='file']");
                const button = elem.parentElement.parentElement.querySelector("button[aria-label='Clear']")
                button && button.click();
                input.value = "";
                input.files = list;
                const event = new Event('change', { 'bubbles': true, "composed": true });
                input.dispatchEvent(event);
            }
        })
    });

}

let executed_webGL_output = false;

window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((m) => {
        if(!executed_webGL_output && gradioApp().querySelector('#WebGL-output')){
            executed_webGL_output = true;

            initWebGLOutput(gradioApp().querySelector('#WebGL-output'))

            observer.disconnect();
        }
    });

    observer.observe(gradioApp(), { childList: true, subtree: true });
})