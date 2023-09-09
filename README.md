# Stable Diffusion WebUI 3D Model&Pose Loader
A custom extension for [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) that allows you to load your local 3D model/animation inside webui, or edit pose as well, then send screenshot to txt2img or img2img as your ControlNet's reference image.  
![1.png](doc/images/1.png)
![controlnet.png](doc/images/controlnet.png)


## Installation
Just like you install other extension of webui:
1. go to Extensions -> Install from URL
2. paste this repo link
3. install
4. go to Installed, apply and restart UI

Or you can install from Extensions -> Available, and load the official extension link, then you can find this extension on the list.
![installFromOfficialLink.png](doc/images/installFromOfficialLink.png)

## Quick Start
1. click **Load Model** button, select one model from your local, check [here](doc/support_formats.md) for support formats, 
2. or click **Load Hand Model**/**Load Body Model** to load embedded hand/body model.
3. On the main canvas, you can use:
   1. **Mouse left button** -> rotate the camera
   2. **Mouse wheel** -> zoom in or out
   3. **Mouse right button** -> move the camera
4. Send the screenshot to ControlNet

## More Details and features
- [Support Formats](/doc/support_formats.md)
- [Settings](/doc/settings.md)
- [Settings From Page](/doc/settings_from_page.md)
- [Render Mode](/doc/render_mode.md)
- [Body model and pose edit](/doc/pose_support.md)
- [Hand Model and gesture edit](/doc/hand_model.md)
- [Send to](/doc/send_to.md)
- [Local Dev](/doc/local_dev.md)

## Gradio.Model3D?
I know gradio has its own 3D model component called **Gradio.Model3D**, but it only supports three formats: obj, glb and gltf, I think it is not enough, at least it should support FBX animation, so I build my own extension.

## Credits
Created by [jtydhr88](https://github.com/jtydhr88) and special thanks to other contributors:
- [missionfloyd](https://github.com/missionfloyd)
- [chucktobbes](https://github.com/chucktobbes)
- Everyone who gives feedback

## My other extension for Stable diffusion webui
- [Canvas Editor](https://github.com/jtydhr88/sd-canvas-editor) A custom extension for AUTOMATIC1111/stable-diffusion-webui that integrated a full capability canvas editor which you can use layer, text, image, elements and so on, then send to ControlNet, basing on Polotno.
- [StableStudio Adapter](https://github.com/jtydhr88/sd-webui-StableStudio) A custom extension for AUTOMATIC1111/stable-diffusion-webui to extend rest APIs to do some local operations, using in StableStudio.
- [Txt/Img to 3D Model](https://github.com/jtydhr88/sd-webui-txt-img-to-3d-model) A custom extension for sd-webui that allow you to generate 3D model from txt or image, basing on OpenAI Shap-E.
- [3D Editor](https://github.com/jtydhr88/sd-webui-3d-editor) A custom extension for sd-webui that with 3D modeling features (add/edit basic elements, load your custom model, modify scene and so on), then send screenshot to txt2img or img2img as your ControlNet's reference image, basing on ThreeJS editor.
