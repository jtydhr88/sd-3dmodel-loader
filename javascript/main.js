var scene;

function uploadFile() {
    const input = document.createElement("input");
    input.type = "file"
    input.addEventListener("change", function(e){
        const file = e.target.files[0];

        var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var fileReader = new FileReader();

		fileReader.addEventListener(
		    'load',
		    function ( event ) {
                var contents = event.target.result;

                var object;

                switch ( extension ) {
                    case 'obj':
                        object = new THREE.OBJLoader().parse(contents);

                        scene.add(object);

                        break;
                    case 'stl':
                        var geometry = new THREE.STLLoader().parse( contents );

                        var material = new THREE.MeshPhongMaterial( { ambient: 0xff5533, color: 0xff5533, specular: 0x111111, shininess: 200 } );

					    var mesh = new THREE.Mesh( geometry, material );

                        scene.add(mesh);

                        break;
                }
            },
            false
        );

		fileReader.readAsText(file);
    })

    input.click();
}

function initWebGLOutput(elem) {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0x101030 );

    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );

    //var width = elem.clientWidth;
    //var height = elem.clientHeight;
    // TODO only hardcode for now

    var width = 512;
    var height = 512;

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    var orbit = new THREE.OrbitControls(camera);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
    });
    renderer.setClearColorHex();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(width, height);

    // show axes in the screen
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    elem.appendChild(renderer.domElement);

    var loader = new THREE.OBJLoader();

    render();

    function render() {
        orbit.update();

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}

function getWebGLOutputScreenshot() {
    var webGLOutputDiv = gradioApp().querySelector('#WebGL-output');

    html2canvas(webGLOutputDiv).then(canvas => {
        sendImage('txt2img', canvas);
    });
}

function sendImage(type, openpose_editor_canvas){

    openpose_editor_canvas.toBlob((blob) => {
        const file = new File(([blob]), "pose.png")
        const dt = new DataTransfer();
        dt.items.add(file);
        const list = dt.files
        const selector = type === "txt2img" ? "#txt2img_script_container" : "#img2img_script_container"
        if (type === "txt2img"){
            switch_to_txt2img()
        }else if(type === "img2img"){
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
            // gradioApp().querySelectorAll("#tabs > div > button").forEach((elem) => {
            //     if (elem.innerText === "OpenPose Editor") elem.click()
            // })
            observer.disconnect();
        }
    })
    observer.observe(gradioApp(), { childList: true, subtree: true })
})