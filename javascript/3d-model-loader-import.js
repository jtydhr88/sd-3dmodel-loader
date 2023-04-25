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
            const threeDModelLoader = await import(`${base_path}/3d-model-loader.bundle.js`);

            return {threeDModelLoader};
        };

        if (!globalThis.threeDModelLoader.imports) {
            globalThis.threeDModelLoader.imports = {};
        }

        if (!globalThis.threeDModelLoader.imports.threeDModelLoader) {
            globalThis.threeDModelLoader.imports.threeDModelLoader = async () => await import(`${base_path}/3d-model-loader.bundle.js`);
        }

        cont.appendChild(df);
    }

    onUiLoaded(function () {
        webGLOutputDiv3DModel = gradioApp().querySelector('#WebGL-output-3dmodel-import');
        load(webGLOutputDiv3DModel);
    })
})();