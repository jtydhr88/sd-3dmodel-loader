console.log('[3D Model Loader] loading...');

async function _import() {
    if (!globalThis.threeDModelLoader || !globalThis.threeDModelLoader.import) {
        return await import('threeDModelLoader');
    } else {
        return await globalThis.threeDModelLoader.imports.threeDModelLoader();
    }
}

await _import();

(async function () {
    const container = gradioApp().querySelector('#threeDModelLoader-container');

    const parent = container.parentNode;
    parent.classList.remove("prose");

    const controlNetNumInput = gradioApp().querySelector('#threeDModelLoader-control-net-num');
    const controlNetNum = controlNetNumInput.value;

    const defaultBGColorInput = gradioApp().querySelector('#threeDModelLoader-default-bg-color');
    const defaultBGColor = defaultBGColorInput.value;

    const defaultGroundColorInput = gradioApp().querySelector('#threeDModelLoader-default-ground-color');
    const defaultGroundColor = defaultGroundColorInput.value;

    const defaultShowGroundInput = gradioApp().querySelector('#threeDModelLoader-default-show-ground');
    const defaultShowGround = defaultShowGroundInput.value;

    const defaultShowGirdInput = gradioApp().querySelector('#threeDModelLoader-default-show-grid');
    const defaultShowGird = defaultShowGirdInput.value;

    const defaultShowAxisInput = gradioApp().querySelector('#threeDModelLoader-default-show-axis');
    const defaultShowAxis = defaultShowAxisInput.value;

    const configs = {
        "controlNetNum": controlNetNum,
        "defaultBGColor": defaultBGColor,
        "defaultGroundColor": defaultGroundColor,
        "defaultShowGround": defaultShowGround === "True",
        "defaultShowGird": defaultShowGird === "True",
        "defaultShowAxis": defaultShowAxis === "True"
    }

    async function init_canvas() {
        create3dmodelLoaderApp({container: container, configs: configs});

        setSendImageFunc3dmodel(sendImage);
    }

    await init_canvas();

    function sendImage(type, index, dt) {
        const selector = type === "txt2img" ? "#txt2img_script_container" : "#img2img_script_container";

        if (type === "txt2img") {
            switch_to_txt2img();
        } else if (type === "img2img") {
            switch_to_img2img();
        }

        let container = gradioApp().querySelector(selector);

        let element = container.querySelector('#controlnet');

        if (!element) {
            for (const spans of container.querySelectorAll < HTMLSpanElement > (
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

                let observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
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

                observer.observe(element, {childList: true, subtree: true});
            }
        } else {
            updateGradioImage(imageElems[Number(index)], dt);
        }
    }

    function updateGradioImage(element, dt) {
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
})();
