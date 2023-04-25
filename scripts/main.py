import gradio as gr

import modules.scripts as scripts
from modules import script_callbacks
from modules import shared
from modules.shared import opts
from modules import extensions

import os


class Script(scripts.Script):
    def __init__(self) -> None:
        super().__init__()

    def title(self):
        return "3D Model&Pose Loader"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        return ()


def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as threeDModel_loader:
        with gr.Row():
            gr.HTML('<div id="threeDModelLoader-container"></div>')

        import_id = 'WebGL-output-3dmodel-import'

        ext = get_self_extension()

        try:
            control_net_num = opts.control_net_max_models_num
        except:
            control_net_num = 0

        gr.HTML(f'<input type="hidden" id="threeDModelLoader-control-net-num" value="{control_net_num}" />', visible=False)

        if ext is None:
            return []
        js_ = [f'{x.path}?{os.path.getmtime(x.path)}' for x in ext.list_files('javascript/lazyload', '.js')]
        js_.insert(0, ext.path)

        gr.HTML(value='\n'.join(js_), elem_id=import_id, visible=False)

    return [(threeDModel_loader, "3D Model&Pose Loader", "3dmodel_loador")]


def get_self_extension():
    if '__file__' in globals():
        filepath = __file__
    else:
        import inspect
        filepath = inspect.getfile(lambda: None)
    for ext in extensions.active():
        if ext.path in filepath:
            return ext


def on_ui_settings():
    section = ('3dmodel', "3D Model&Pose")
    shared.opts.add_option("threeDmodel_bg_color", shared.OptionInfo(
        "#ffffff", "Canvas Background Color", gr.ColorPicker, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_ground_color", shared.OptionInfo(
        "#ffffff", "Canvas Ground Color", gr.ColorPicker, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_canvas_width", shared.OptionInfo(
        512, "Canvas Width", gr.Slider, {"minimum": 64, "maximum": 2048, "step": 64, "interactive": True},
        section=section))
    shared.opts.add_option("threeDmodel_canvas_height", shared.OptionInfo(
        512, "Canvas Height", gr.Slider, {"minimum": 64, "maximum": 2048, "step": 64, "interactive": True},
        section=section))
    shared.opts.add_option("threeDmodel_has_ground", shared.OptionInfo(
        True, "Show Ground", gr.Checkbox, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_has_ground_grid", shared.OptionInfo(
        True, "Show Grid", gr.Checkbox, {"interactive": True}, section=section))
    shared.opts.add_option("threeDmodel_has_axis", shared.OptionInfo(
        True, "Show Axis", gr.Checkbox, {"interactive": True}, section=section))


script_callbacks.on_ui_tabs(on_ui_tabs)
script_callbacks.on_ui_settings(on_ui_settings)
