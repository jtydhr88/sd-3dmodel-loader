import os
import numpy as np
import cv2

import gradio as gr

import modules.scripts as scripts
from modules import script_callbacks
from pathlib import Path

def pil2cv(in_image):
    out_image = np.array(in_image, dtype=np.uint8)

    if out_image.shape[2] == 3:
        out_image = cv2.cvtColor(out_image, cv2.COLOR_RGB2BGR)
    return out_image


def candidate2li(li):
    res = []
    for x, y, *_ in li:
        res.append([x, y])
    return res


def subset2li(li):
    res = []
    for r in li:
        for c in r:
            res.append(c)
    return res


class Script(scripts.Script):
    def __init__(self) -> None:
        super().__init__()

    def title(self):
        return "3D Model Loader"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        return ()

base_dir = Path(scripts.basedir())

def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as openpose_editor:
        with gr.Row():
            with gr.Column():
                width = gr.Slider(label="width", minimum=64, maximum=2048, value=512, step=64, interactive=True)
                height = gr.Slider(label="height", minimum=64, maximum=2048, value=512, step=64, interactive=True)
                with gr.Row():
                    add = gr.Button(value="Add", variant="primary")
                    # delete = gr.Button(value="Delete")
                with gr.Row():
                    reset_btn = gr.Button(value="Reset")
                    json_input = gr.Button(value="Load from JSON")
                    png_input = gr.Button(value="Detect from image")
                    png_input_area = gr.Image(label="Detect from image", elem_id="openpose_editor_input")
                    bg_input = gr.Button(value="Add Background image")

            with gr.Column():
                # gradioooooo...

                gr.HTML('<div id="WebGL-output" style="width: 512px; height: 512px; border-radius: 0.25rem; border: 0.5px solid"></div>')
                
                jsonbox = gr.Text(label="json", elem_id="hide_json")
                with gr.Row():
                    json_output = gr.Button(value="Save JSON")
                    png_output = gr.Button(value="Save PNG")
                    send_t2t = gr.Button(value="Send to txt2img")
                    send_i2i = gr.Button(value="Send to img2img")
                    select_target_index = gr.Dropdown([str(i) for i in range(10)], label="Send to", value="0",
                                                      interactive=True)

        width.change(None, [width, height], None, _js="(w, h) => {resizeCanvas(w, h)}")
        height.change(None, [width, height], None, _js="(w, h) => {resizeCanvas(w, h)}")
        png_output.click(None, [], None, _js="savePNG")
        bg_input.click(None, [], None, _js="addBackground")
        png_input.click(None, [], None, _js="detectImage")
        add.click(None, [], None, _js="getWebGLOutputScreenshot")
        send_t2t.click(None, [], None, _js="() => {sendImage('txt2img')}")
        send_i2i.click(None, [], None, _js="() => {sendImage('img2img')}")
        select_target_index.change(None, [select_target_index], None, _js="(i) => {updateTargetIndex(parseInt(i, 10))}")
        reset_btn.click(None, [], None, _js="resetCanvas")
        json_input.click(None, None, [width, height], _js="loadJSON")
        json_output.click(None, None, None, _js="saveJSON")

    return [(openpose_editor, "3d Model Loader", "3dmodel_loador")]


script_callbacks.on_ui_tabs(on_ui_tabs)
