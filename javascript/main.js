function initWebGLOutput(elem) {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    //var width = elem.clientWidth;
    //var height = elem.clientHeight;
    // TODO hardcode for now

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

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    // create a sphere
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    // add the sphere to the scene
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    elem.appendChild(renderer.domElement);

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