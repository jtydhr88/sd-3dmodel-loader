import gradio as gr

import modules.scripts as scripts
from modules import script_callbacks
from modules import shared
from modules.shared import opts

class Script(scripts.Script):
    def __init__(self) -> None:
        super().__init__()

    def title(self):
        return "3D Model Loader"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        return ()

def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as threeDModel_loader:
        with gr.Row():
            with gr.Column():
                with gr.Row():
                    with gr.Column():
                        width_page = gr.Slider(label="Width", minimum=64, maximum=2048, value=512, step=64, interactive=True)
                        height_page = gr.Slider(label="Height", minimum=64, maximum=2048, value=512, step=64, interactive=True)
                    with gr.Column():
                        change_target_radio = gr.Radio(["Light", "Model"], label="Target")
                        position_rotate_x_page = gr.Slider(
                            label="Position/Rotate X", minimum=-1, maximum=1, value=0, step=0.01, interactive=True)
                        position_rotate_y_page = gr.Slider(
                            label="Position/Rotate Y", minimum=-1, maximum=1, value=0, step=0.01, interactive=True)
                        position_rotate_z_page = gr.Slider(
                            label="Position/Rotate Z", minimum=-1, maximum=1, value=0, step=0.01, interactive=True)
                with gr.Row():
                    has_ground_page = gr.Checkbox(label="Show Ground", value=opts.threeDmodel_has_ground)
                    has_ground_grid_page = gr.Checkbox(label="Show Grid", value=opts.threeDmodel_has_ground_grid)
                    has_axis_page = gr.Checkbox(label="Show Axis", value=opts.threeDmodel_has_axis)
                    with gr.Row():
                        color_page = gr.ColorPicker(label="Background Color", value=opts.threeDmodel_bg_color, elem_id="bg_color")
                        ground_color_page = gr.ColorPicker(label="Ground Color", value=opts.threeDmodel_ground_color, elem_id="ground_color")
                        light_color_page = gr.ColorPicker(label="Light Color", value=opts.threeDmodel_ground_color,
                                                           elem_id="Light_color")
                with gr.Row():
                    model_scale_page = gr.Slider(label="Model Scale", minimum=0.01, maximum=10, step=0.01, value=1)
                with gr.Row():
                    upload_button = gr.Button(value="Load Model", variant="primary")
                with gr.Row():
                    reset_btn = gr.Button(value="Reset")
                    send_t2t = gr.Button(value="Send to txt2img")
                    send_i2i = gr.Button(value="Send to img2img")
                    select_target_index = gr.Dropdown([str(i) for i in range(opts.control_net_max_models_num)],
                                                      label="Send to", value="0", interactive=True,
                                                      visible=(opts.control_net_max_models_num > 1))
                with gr.Row():
                    play_pause_button = gr.Button(value="Play/Pause")
                    stop_button = gr.Button(value="Stop")

            with gr.Column():
                gr.HTML(f'<div id="WebGL-output-3dmodel" canvas_width="{opts.threeDmodel_canvas_width}" canvas_height="{opts.threeDmodel_canvas_height}" ' +
                        f'canvas_bg_color="{opts.threeDmodel_bg_color}" canvas_ground_color="{opts.threeDmodel_ground_color}" ' +
                        f'has_ground="{opts.threeDmodel_has_ground}" has_ground_grid="{opts.threeDmodel_has_ground_grid}" has_axis="{opts.threeDmodel_has_axis}" ' +
                        f'style="width: {int(opts.threeDmodel_canvas_width) + 2}px; height: {int(opts.threeDmodel_canvas_height) + 2}px; border: 0.5px solid;"></div>')

        position_rotate_x_page.change(None, [position_rotate_x_page, position_rotate_y_page, position_rotate_z_page],
                                      None, _js="moveOrRotateTarget3DModel")
        position_rotate_y_page.change(None, [position_rotate_x_page, position_rotate_y_page, position_rotate_z_page],
                                      None, _js="moveOrRotateTarget3DModel")
        position_rotate_z_page.change(None, [position_rotate_x_page, position_rotate_y_page, position_rotate_z_page],
                                      None, _js="moveOrRotateTarget3DModel")
        change_target_radio.change(None, [change_target_radio], None, _js="setTarget3DModel")
        width_page.change(None, [width_page, height_page], None, _js="setCanvasSize3DModel")
        height_page.change(None, [width_page, height_page], None, _js="setCanvasSize3DModel")
        model_scale_page.change(None, [model_scale_page], None, _js="updateModel3DModel")
        has_ground_page.change(None, [has_ground_page], None, _js="setGroundVisible3DModel")
        has_ground_grid_page.change(None, [has_ground_grid_page], None, _js="setGroundGridVisible3DModel")
        has_axis_page.change(None, [has_axis_page], None, _js="setAxisVisible3DModel")
        color_page.change(None, [color_page], None, _js="setBGColor3DModel")
        ground_color_page.change(None, [ground_color_page], None, _js="setGroundColor3DModel")
        light_color_page.change(None, [light_color_page], None, _js="setLightColor3DModel")
        play_pause_button.click(None, [], None, _js="playAndPause3DModel")
        stop_button.click(None, [], None, _js="stop3DModel")
        send_t2t.click(None, select_target_index, None, _js="(i) => {sendImage3DModel('txt2img', i)}")
        send_i2i.click(None, select_target_index, None, _js="(i) => {sendImage3DModel('img2img', i)}")
        reset_btn.click(None, [], None, _js="restCanvasAndCamera3DModel")
        upload_button.click(None, None, None, _js="uploadFile3DModel")

    return [(threeDModel_loader, "3D Model Loader", "3dmodel_loador")]

def on_ui_settings():
    section = ('3dmodel', "3D Model")
    shared.opts.add_option("threeDmodel_bg_color", shared.OptionInfo(
        "#ffffff", "Canvas Background Color", gr.ColorPicker, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_ground_color", shared.OptionInfo(
        "#ffffff", "Canvas Ground Color", gr.ColorPicker, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_canvas_width", shared.OptionInfo(
        512, "Canvas Width", gr.Slider, {"minimum": 64, "maximum": 2048, "step": 64, "interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_canvas_height", shared.OptionInfo(
        512, "Canvas Height", gr.Slider, {"minimum": 64, "maximum": 2048, "step": 64, "interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_has_ground", shared.OptionInfo(
        True, "Show Ground", gr.Checkbox, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_has_ground_grid", shared.OptionInfo(
        True, "Show Grid", gr.Checkbox, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_has_axis", shared.OptionInfo(
        True, "Show Axis", gr.Checkbox, {"interactive": True}, section=section))

script_callbacks.on_ui_tabs(on_ui_tabs)
script_callbacks.on_ui_settings(on_ui_settings)
