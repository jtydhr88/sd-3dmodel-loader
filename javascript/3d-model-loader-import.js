(function () {
    if (!globalThis.threeDModelLoader) globalThis.threeDModelLoader = {};
    const threeDModelLoader = globalThis.threeDModelLoader;

    function load(cont) {
        const scripts = cont.textContent.trim().split('\n');
        const base_path = `/file=${scripts.shift()}/js`;
        cont.textContent = '';

        const df = document.createDocumentFragment();
        for (let src of scripts) {
            const script = document.createElement('script');
            script.async = true;
            script.type = 'module';
            script.src = `file=${src}`;
            df.appendChild(script);
        }

        globalThis.threeDModelLoader.import = async () => {
            const THREE = await import(`${base_path}/three.module.js`);
            const { OrbitControls } = await import(`${base_path}/OrbitControls.js`);
            const { OBJLoader } = await import(`${base_path}/OBJLoader.js`);
            const { STLLoader } = await import(`${base_path}/STLLoader.js`);
            const { FBXLoader } = await import(`${base_path}/FBXLoader.js`);
            const { GLTFLoader } = await import(`${base_path}/GLTFLoader.js`);
            const { DRACOLoader } = await import(`${base_path}/DRACOLoader.js`);
            const { ColladaLoader } = await import(`${base_path}/ColladaLoader.js`);
            const { VRMLoaderPlugin } = await import(`${base_path}/three-vrm.module.js`);

            return { THREE, OrbitControls, OBJLoader, STLLoader, FBXLoader, GLTFLoader, DRACOLoader, ColladaLoader, VRMLoaderPlugin };
        };

        if (!globalThis.threeDModelLoader.imports) {
            globalThis.threeDModelLoader.imports = {};
        }

        if (!globalThis.threeDModelLoader.imports.three) {
            globalThis.threeDModelLoader.imports.three = async () => await import(`${base_path}/three.module.js`);
        }

        if (!globalThis.threeDModelLoader.imports.threeVRM) {
            globalThis.threeDModelLoader.imports.threeVRM = async () => await import(`${base_path}/three-vrm.module.js`);
        }

        if (!globalThis.threeDModelLoader.imports.tagLoader) {
            globalThis.threeDModelLoader.imports.tagLoader = async () => await import(`${base_path}/TGALoader.js`);
        }

        if (!globalThis.threeDModelLoader.imports.threeDModelLoader) {
            globalThis.threeDModelLoader.imports.threeDModelLoader = async () => await import(`${base_path}/3d-model-loader.js`);
        }

        if (!globalThis.threeDModelLoader.imports.fflateUnzlibSync) {
            globalThis.threeDModelLoader.imports.fflateUnzlibSync = async () => await import(`${base_path}/fflate.module.js`);
        }

        cont.appendChild(df);
    }

    function checkDivVisible(div) {
        if ((div.offsetWidth > 0) && (div.offsetHeight > 0)) {
            return true;
        }

        return false;
    }

    let executed_webGL_output_3dmodel = false;

    window.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver((m) => {
            if (!executed_webGL_output_3dmodel && gradioApp().querySelector('#WebGL-output-3dmodel')) {
                executed_webGL_output_3dmodel = true;

                webGLOutputDiv3DModel = gradioApp().querySelector('#WebGL-output-3dmodel-import');

                load(webGLOutputDiv3DModel);

                observer.disconnect();
            }
        });

        observer.observe(gradioApp(), {
            childList: true,
            subtree: true
        });
    })
})();