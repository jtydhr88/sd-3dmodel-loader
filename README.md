# Stable Diffusion WebUI 3D Model Loader
A custom extension for [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) that allows you to load your local 3D model/animation inside webui, then send screenshot to txt2img or img2img as your ControlNet's reference image.  
![1.png](doc/images/1.png)
![controlnet.png](doc/images/controlnet.png)

## Support formats
Currently, it supports to load several types:
1. obj
2. stl
3. fbx
4. glb - partly support, it fails on the model needs draco_decoder (like [IridescentDishWithOlives.glb](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/IridescentDishWithOlives.glb)) or KTX2 textures (like [coffeemat.glb](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/coffeemat.glb)), need to figure out how to fix later
5. gltf - partly support, it fails on the model has other resources (like [DamagedHelmet.gltf](https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/DamagedHelmet/glTF)), need to figure out how to fix later

But it has potential to support more, since threejs supports.
So if you want other formats such as cmt, just feel free to open an issue, I will add it later.  
(I upload two models, **male02.obj** and **Sanba Dancing.fbx**, as your test, you can find them under **/models** folder)

## Installation
Just like you install other extension of webui:
1. go to Extensions -> Install from URL
2. paste this repo link
3. install
4. go to Installed, apply and restart UI

Or you can install from Extensions -> Available, and load the official extension link, then you can find this extension on the list.
![installFromOfficialLink.png](doc/images/installFromOfficialLink.png)

## Settings
Right there are some configurations under Settings -> 3D Model:
1. Canvas Background Color
2. Canvas ground Color
3. Canvas Width
4. Canvas Height
5. Show Ground
6. Show Grid
7. Show Axis
![configureFromSettings.png](doc/images/configureFromSettings.png)

After you change any configurations, do not **only** Apply Settings, you also need to go Extensions then click Apply and restart UI to make the settings effect.

You can also configure the canvas from the main tab page, the default values would read from settings, but no need to reload if configured here. 
![configureFromPage.png](doc/images/configureFromPage.png)
## Operation
On the main tab of 3D Model Loader, you can use:
1. **Mouse left button** -> rotate the camera
2. **Mouse wheel** -> zoom in or out
3. **Mouse right button** -> move the camera

there are several buttons on the page:
1. **Upload Model** -> upload your 3D model file
2. **Reset** -> reset the camera to default position and remove all uploaded objects (There are some issues on this feature, I will fix soon)
3. **Send to txt2img** -> Send the current view of the 3D model on ControlNet in txt2img 
4. **Send to img2img** -> Send the current view of the 3D model on ControlNet in img2img
5. **Send to** -> If you have multi ControlNet, you can select the one you want to send
6. **Play/Pause/Stop** -> control the FBX animation playing
![buttons.png](doc/images/buttons.png)

## Gradio.Model3D?
I know gradio has its own 3D model component called **Gradio.Model3D**, but it only supports three formats: obj, glb and gltf, I think it is not enough, at least it should support FBX animation, so I build my own extension.

## Further Plan
Even ThreeJS has superpower to do huge graphic works, such as Light, Texture, and so on.  
However I don't want to rebuild a C4D or Blender inside stable diffusion webui (Actually ThreeJS already has it, called **editor** see [here](https://threejs.org/editor/))
Thus this extension will focus on user experience to give you better reference image from your 3D Model.

## Credits
Created by [jtydhr88](https://github.com/jtydhr88) and special thanks to other contributors:
- [missionfloyd](https://github.com/missionfloyd)
- Everyone who gives feedback