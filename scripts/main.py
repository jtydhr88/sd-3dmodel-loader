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
        return "3D Model Loader"

    def show(self, is_img2img):
        return scripts.AlwaysVisible

    def ui(self, is_img2img):
        return ()


def on_ui_tabs():
    with gr.Blocks(analytics_enabled=False) as threeDModel_loader:
        with gr.Row():
            with gr.Column():
                with gr.Accordion("Pose", open=False):
                    with gr.Row():
                        load_pose_button = gr.Button(value="Load Pose Model", variant="primary")
                    with gr.Accordion("Body", open=False):
                        with gr.Row():
                            neck_x_page = gr.Slider(
                                label="Neck X", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            neck_y_page = gr.Slider(
                                label="Neck Y", minimum=-0.3, maximum=0.3, value=0, step=0.01, interactive=True)
                            neck_z_page = gr.Slider(
                                label="Neck Z", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                        with gr.Row():
                            spine_x_page = gr.Slider(
                                label="Spine X", minimum=-0.1, maximum=0.5, value=0, step=0.01, interactive=True)
                            spine_y_page = gr.Slider(
                                label="Spine Y", minimum=-0.3, maximum=0.3, value=0, step=0.01, interactive=True)
                            spine_z_page = gr.Slider(
                                label="Spine Z", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                    with gr.Accordion("Left Arm", open=False):
                        with gr.Row():
                            left_upper_arm_x_page = gr.Slider(
                                label="LeftUpperArm X", minimum=-0.3, maximum=0.3, value=0, step=0.01, interactive=True)
                            left_upper_arm_y_page = gr.Slider(
                                label="LeftUpperArm Y", minimum=-0.5, maximum=0.2, value=0, step=0.01, interactive=True)
                            left_upper_arm_z_page = gr.Slider(
                                label="LeftUpperArm Z", minimum=-0.4, maximum=0.4, value=0, step=0.01, interactive=True)
                        with gr.Row():
                            left_lower_arm_x_page = gr.Slider(
                                label="LeftLowerArm X", minimum=-0.3, maximum=0.3, value=0, step=0.01, interactive=True)
                            left_lower_arm_y_page = gr.Slider(
                                label="LeftLowerArm Y", minimum=-0.5, maximum=0.2, value=0, step=0.01, interactive=True)
                            left_lower_arm_z_page = gr.Slider(
                                label="LeftLowerArm Z", minimum=-0.4, maximum=0.1, value=0, step=0.01, interactive=True)
                        with gr.Row():
                            left_hand_x_page = gr.Slider(
                                label="LeftHand X", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            left_hand_y_page = gr.Slider(
                                label="LeftHand Y", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)
                            left_hand_z_page = gr.Slider(
                                label="LeftHand Z", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)

                    with gr.Accordion("Right Arm", open=False):
                        with gr.Row():
                            right_upper_arm_x_page = gr.Slider(
                                label="RightUpperArm X", minimum=-0.3, maximum=0.3, value=0, step=0.01, interactive=True)
                            right_upper_arm_y_page = gr.Slider(
                                label="RightUpperArm Y", minimum=-0.5, maximum=0.2, value=0, step=0.01, interactive=True)
                            right_upper_arm_z_page = gr.Slider(
                                label="RightUpperArm Z", minimum=-0.4, maximum=0.4, value=0, step=0.01, interactive=True)
                        with gr.Row():
                            right_lower_arm_x_page = gr.Slider(
                                label="RightLowerArm X", minimum=-0.3, maximum=0.3, value=0, step=0.01, interactive=True)
                            right_lower_arm_y_page = gr.Slider(
                                label="RightLowerArm Y", minimum=-0.5, maximum=0.2, value=0, step=0.01, interactive=True)
                            right_lower_arm_z_page = gr.Slider(
                                label="RightLowerArm Z", minimum=-0.4, maximum=0.1, value=0, step=0.01, interactive=True)
                        with gr.Row():
                            right_hand_x_page = gr.Slider(
                                label="RightHand X", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            right_hand_y_page = gr.Slider(
                                label="RightHand Y", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)
                            right_hand_z_page = gr.Slider(
                                label="RightHand Z", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)

                    with gr.Accordion("Left Leg", open=False):
                        with gr.Row():
                            left_upper_leg_x_page = gr.Slider(
                                label="LeftUpperLeg X", minimum=-0.5, maximum=0.3, value=0, step=0.01, interactive=True)
                            left_upper_leg_y_page = gr.Slider(
                                label="LeftUpperLeg Y", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            left_upper_leg_z_page = gr.Slider(
                                label="LeftUpperLeg Z", minimum=-0.1, maximum=0.6, value=0, step=0.01, interactive=True)
                        with gr.Row():
                            left_lower_leg_x_page = gr.Slider(
                                label="LeftLowerLeg X", minimum=-0.05, maximum=0.7, value=0, step=0.01, interactive=True)
                            left_lower_leg_y_page = gr.Slider(
                                label="LeftLowerLeg Y", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            left_lower_leg_z_page = gr.Slider(
                                label="LeftLowerLeg Z", minimum=-0.05, maximum=0.05, value=0, step=0.01, interactive=True)
                        with gr.Row():
                            left_foot_x_page = gr.Slider(
                                label="LeftFoot X", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            left_foot_y_page = gr.Slider(
                                label="LeftFoot Y", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)
                            left_foot_z_page = gr.Slider(
                                label="LeftFoot Z", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)

                    with gr.Accordion("Right Leg", open=False):
                        with gr.Row():
                            right_upper_leg_x_page = gr.Slider(
                                label="RightUpperLeg X", minimum=-0.5, maximum=0.3, value=0, step=0.01, interactive=True)
                            right_upper_leg_y_page = gr.Slider(
                                label="RightUpperLeg Y", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            right_upper_leg_z_page = gr.Slider(
                                label="RightUpperLeg Z", minimum=-0.1, maximum=0.6, value=0, step=0.01, interactive=True)

                        with gr.Row():
                            right_lower_leg_x_page = gr.Slider(
                                label="RightLowerLeg X", minimum=-0.05, maximum=0.7, value=0, step=0.01, interactive=True)
                            right_lower_leg_y_page = gr.Slider(
                                label="RightLowerLeg Y", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            right_lower_leg_z_page = gr.Slider(
                                label="RightLowerLeg Z", minimum=-0.05, maximum=0.05, value=0, step=0.01, interactive=True)

                        with gr.Row():
                            right_foot_x_page = gr.Slider(
                                label="RightFoot X", minimum=-0.2, maximum=0.2, value=0, step=0.01, interactive=True)
                            right_foot_y_page = gr.Slider(
                                label="RightFoot Y", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)
                            right_foot_z_page = gr.Slider(
                                label="RightFoot Z", minimum=-0.1, maximum=0.1, value=0, step=0.01, interactive=True)
                    with gr.Row():
                        save_pose_as_json_button = gr.Button(value="Save Pose as json")
                        load_pose_from_json_button = gr.Button(value="Load Pose from json")
                with gr.Accordion("Canvas", open=False):
                    with gr.Row():
                        with gr.Column():
                            width_page = gr.Slider(label="Width", minimum=64, maximum=2048, value=512, step=64,
                                                   interactive=True)
                            height_page = gr.Slider(label="Height", minimum=64, maximum=2048, value=512, step=64,
                                                    interactive=True)
                        with gr.Column():
                            light_position_x_page = gr.Slider(
                                label="Light Position X", minimum=-100, maximum=100, value=0, step=1, interactive=True)
                            light_position_y_page = gr.Slider(
                                label="Light Position Y", minimum=0, maximum=100, value=30, step=1, interactive=True)
                            light_position_z_page = gr.Slider(
                                label="Light Position Z", minimum=-100, maximum=100, value=0, step=1, interactive=True)
                    with gr.Row():
                        has_ground_page = gr.Checkbox(label="Show Ground", value=opts.threeDmodel_has_ground)
                        has_ground_grid_page = gr.Checkbox(label="Show Grid", value=opts.threeDmodel_has_ground_grid)
                        has_axis_page = gr.Checkbox(label="Show Axis", value=opts.threeDmodel_has_axis)
                        with gr.Row():
                            color_page = gr.ColorPicker(label="Background Color", value=opts.threeDmodel_bg_color,
                                                        elem_id="bg_color")
                            ground_color_page = gr.ColorPicker(label="Ground Color",
                                                               value=opts.threeDmodel_ground_color,
                                                               elem_id="ground_color")
                            light_color_page = gr.ColorPicker(label="Light Color", value=opts.threeDmodel_ground_color,
                                                              elem_id="Light_color")
                with gr.Accordion("Model", open=False):
                    with gr.Row():
                        model_scale_page = gr.Slider(label="Scale", minimum=0.01, maximum=10, step=0.01, value=1)
                    with gr.Row():
                        model_rotate_x_page = gr.Slider(
                            label="Rotate X", minimum=-1, maximum=1, value=0, step=0.01, interactive=True)
                        model_rotate_y_page = gr.Slider(
                            label="Rotate Y", minimum=-1, maximum=1, value=0, step=0.01, interactive=True)
                        model_rotate_z_page = gr.Slider(
                            label="Rotate Z", minimum=-1, maximum=1, value=0, step=0.01, interactive=True)

                with gr.Row():
                    upload_button = gr.Button(value="Load Model", variant="primary")
                with gr.Accordion("Upload Settings", open=False):
                    with gr.Row():
                        multi_files_checkbox = gr.Checkbox(label="includes additional resource(multi files select)")
                        entry_type = gr.Dropdown(["vrm"], label="Entry Type", interactive=True, visible=True)
                    with gr.Row():
                        gr.HTML("<div>Notice, currently multi files select only supports VRM models combine with FBX "
                                "animation from Mixamo, other formats support will add later </div>")

                with gr.Row():
                    reset_btn = gr.Button(value="Reset")
                    send_t2t = gr.Button(value="Send to txt2img")
                    send_i2i = gr.Button(value="Send to img2img")

                    try:
                        control_net_num = opts.control_net_max_models_num
                    except:
                        control_net_num = 1

                    select_target_index = gr.Dropdown([str(i) for i in range(control_net_num)],
                                                      label="Send to", value="0", interactive=True,
                                                      visible=(control_net_num > 1))


                with gr.Accordion("Animation", open=False):
                    with gr.Row():
                        play_pause_button = gr.Button(value="Play/Pause")
                        stop_button = gr.Button(value="Stop")
                    with gr.Row():
                        progress_bar = gr.Slider(label="Progress", minimum=0, maximum=100, value=0, step=0.5,
                                                 interactive=True, elem_id="progress_bar_3dmodel")

            with gr.Column():
                gr.HTML(
                    f'<div id="WebGL-output-3dmodel" canvas_width="{opts.threeDmodel_canvas_width}" canvas_height="{opts.threeDmodel_canvas_height}" ' +
                    f'canvas_bg_color="{opts.threeDmodel_bg_color}" canvas_ground_color="{opts.threeDmodel_ground_color}" ' +
                    f'has_ground="{opts.threeDmodel_has_ground}" has_ground_grid="{opts.threeDmodel_has_ground_grid}" has_axis="{opts.threeDmodel_has_axis}" ' +
                    f'style="width: {int(opts.threeDmodel_canvas_width) + 2}px; height: {int(opts.threeDmodel_canvas_height) + 2}px; border: 0.5px solid;"></div>')

                import_id = 'WebGL-output-3dmodel-import'

                ext = get_self_extension()
                if ext is None:
                    return []
                js_ = [f'{x.path}?{os.path.getmtime(x.path)}' for x in ext.list_files('javascript/lazyload', '.js')]
                js_.insert(0, ext.path)

                gr.HTML(value='\n'.join(js_), elem_id=import_id, visible=False)

        save_pose_as_json_button.click(None, None, None, _js='savePoseAsJson3DModel')
        load_pose_from_json_button.click(None, None, None, _js='loadPoseFromJson3DModel')

        load_pose_button.click(None, None, None, _js='loadPoseFile3DModel')

        spine_x_page.change(None, [spine_x_page, spine_y_page, spine_z_page],
                                 None,
                                 _js="poseRotateSpine3DModel")
        spine_y_page.change(None, [spine_x_page, spine_y_page, spine_z_page],
                                 None,
                                 _js="poseRotateSpine3DModel")
        spine_z_page.change(None, [spine_x_page, spine_y_page, spine_z_page],
                                 None,
                                 _js="poseRotateSpine3DModel")

        right_foot_x_page.change(None, [right_foot_x_page, right_foot_y_page, right_foot_z_page],
                                 None,
                                 _js="poseRotateRightFoot3DModel")
        right_foot_y_page.change(None, [right_foot_x_page, right_foot_y_page, right_foot_z_page],
                                 None,
                                 _js="poseRotateRightFoot3DModel")
        right_foot_z_page.change(None, [right_foot_x_page, right_foot_y_page, right_foot_z_page],
                                 None,
                                 _js="poseRotateRightFoot3DModel")

        left_foot_x_page.change(None, [left_foot_x_page, left_foot_y_page, left_foot_z_page], None,
                                _js="poseRotateLeftFoot3DModel")
        left_foot_y_page.change(None, [left_foot_x_page, left_foot_y_page, left_foot_z_page], None,
                                _js="poseRotateLeftFoot3DModel")
        left_foot_z_page.change(None, [left_foot_x_page, left_foot_y_page, left_foot_z_page], None,
                                _js="poseRotateLeftFoot3DModel")

        right_hand_x_page.change(None, [right_hand_x_page, right_hand_y_page, right_hand_z_page],
                                      None,
                                      _js="poseRotateRightHand3DModel")
        right_hand_y_page.change(None, [right_hand_x_page, right_hand_y_page, right_hand_z_page],
                                      None,
                                      _js="poseRotateRightHand3DModel")
        right_hand_z_page.change(None, [right_hand_x_page, right_hand_y_page, right_hand_z_page],
                                      None,
                                      _js="poseRotateRightHand3DModel")

        left_hand_x_page.change(None, [left_hand_x_page, left_hand_y_page, left_hand_z_page], None,
                                     _js="poseRotateLeftHand3DModel")
        left_hand_y_page.change(None, [left_hand_x_page, left_hand_y_page, left_hand_z_page], None,
                                     _js="poseRotateLeftHand3DModel")
        left_hand_z_page.change(None, [left_hand_x_page, left_hand_y_page, left_hand_z_page], None,
                                     _js="poseRotateLeftHand3DModel")

        right_lower_leg_x_page.change(None, [right_lower_leg_x_page, right_lower_leg_y_page, right_lower_leg_z_page],
                                      None,
                                      _js="poseRotateRightLowerLeg3DModel")
        right_lower_leg_y_page.change(None, [right_lower_leg_x_page, right_lower_leg_y_page, right_lower_leg_z_page],
                                      None,
                                      _js="poseRotateRightLowerLeg3DModel")
        right_lower_leg_z_page.change(None, [right_lower_leg_x_page, right_lower_leg_y_page, right_lower_leg_z_page],
                                      None,
                                      _js="poseRotateRightLowerLeg3DModel")

        left_lower_leg_x_page.change(None, [left_lower_leg_x_page, left_lower_leg_y_page, left_lower_leg_z_page], None,
                                     _js="poseRotateLeftLowerLeg3DModel")
        left_lower_leg_y_page.change(None, [left_lower_leg_x_page, left_lower_leg_y_page, left_lower_leg_z_page], None,
                                     _js="poseRotateLeftLowerLeg3DModel")
        left_lower_leg_z_page.change(None, [left_lower_leg_x_page, left_lower_leg_y_page, left_lower_leg_z_page], None,
                                     _js="poseRotateLeftLowerLeg3DModel")

        right_upper_leg_x_page.change(None, [right_upper_leg_x_page, right_upper_leg_y_page, right_upper_leg_z_page], None,
                                     _js="poseRotateRightUpperLeg3DModel")
        right_upper_leg_y_page.change(None, [right_upper_leg_x_page, right_upper_leg_y_page, right_upper_leg_z_page], None,
                                     _js="poseRotateRightUpperLeg3DModel")
        right_upper_leg_z_page.change(None, [right_upper_leg_x_page, right_upper_leg_y_page, right_upper_leg_z_page], None,
                                     _js="poseRotateRightUpperLeg3DModel")

        left_upper_leg_x_page.change(None, [left_upper_leg_x_page, left_upper_leg_y_page, left_upper_leg_z_page], None,
                                     _js="poseRotateLeftUpperLeg3DModel")
        left_upper_leg_y_page.change(None, [left_upper_leg_x_page, left_upper_leg_y_page, left_upper_leg_z_page], None,
                                     _js="poseRotateLeftUpperLeg3DModel")
        left_upper_leg_z_page.change(None, [left_upper_leg_x_page, left_upper_leg_y_page, left_upper_leg_z_page], None,
                                     _js="poseRotateLeftUpperLeg3DModel")

        left_lower_arm_x_page.change(None, [left_lower_arm_x_page, left_lower_arm_y_page, left_lower_arm_z_page], None, _js="poseRotateLeftLowerArm3DModel")
        left_lower_arm_y_page.change(None, [left_lower_arm_x_page, left_lower_arm_y_page, left_lower_arm_z_page], None, _js="poseRotateLeftLowerArm3DModel")
        left_lower_arm_z_page.change(None, [left_lower_arm_x_page, left_lower_arm_y_page, left_lower_arm_z_page], None, _js="poseRotateLeftLowerArm3DModel")

        right_lower_arm_x_page.change(None, [right_lower_arm_x_page, right_lower_arm_y_page, right_lower_arm_z_page], None, _js="poseRotateRightLowerArm3DModel")
        right_lower_arm_y_page.change(None, [right_lower_arm_x_page, right_lower_arm_y_page, right_lower_arm_z_page], None, _js="poseRotateRightLowerArm3DModel")
        right_lower_arm_z_page.change(None, [right_lower_arm_x_page, right_lower_arm_y_page, right_lower_arm_z_page], None, _js="poseRotateRightLowerArm3DModel")

        left_upper_arm_x_page.change(None, [left_upper_arm_x_page, left_upper_arm_y_page, left_upper_arm_z_page], None, _js="poseRotateLeftUpperArm3DModel")
        left_upper_arm_y_page.change(None, [left_upper_arm_x_page, left_upper_arm_y_page, left_upper_arm_z_page], None, _js="poseRotateLeftUpperArm3DModel")
        left_upper_arm_z_page.change(None, [left_upper_arm_x_page, left_upper_arm_y_page, left_upper_arm_z_page], None, _js="poseRotateLeftUpperArm3DModel")

        right_upper_arm_x_page.change(None, [right_upper_arm_x_page, right_upper_arm_y_page, right_upper_arm_z_page], None, _js="poseRotateRightUpperArm3DModel")
        right_upper_arm_y_page.change(None, [right_upper_arm_x_page, right_upper_arm_y_page, right_upper_arm_z_page], None, _js="poseRotateRightUpperArm3DModel")
        right_upper_arm_z_page.change(None, [right_upper_arm_x_page, right_upper_arm_y_page, right_upper_arm_z_page], None, _js="poseRotateRightUpperArm3DModel")

        neck_x_page.change(None, [neck_x_page, neck_y_page, neck_z_page], None, _js="poseRotateNeck3DModel")
        neck_y_page.change(None, [neck_x_page, neck_y_page, neck_z_page], None, _js="poseRotateNeck3DModel")
        neck_z_page.change(None, [neck_x_page, neck_y_page, neck_z_page], None,
                                  _js="poseRotateNeck3DModel")

        progress_bar.change(None, [progress_bar], None, _js="setCurrentAnimationTime3DModel")
        model_rotate_x_page.change(None, [model_rotate_x_page, model_rotate_y_page, model_rotate_z_page],
                                   None, _js="rotateModel3DModel")
        model_rotate_y_page.change(None, [model_rotate_x_page, model_rotate_y_page, model_rotate_z_page],
                                   None, _js="rotateModel3DModel")
        model_rotate_z_page.change(None, [model_rotate_x_page, model_rotate_y_page, model_rotate_z_page],
                                   None, _js="rotateModel3DModel")

        light_position_x_page.change(None, [light_position_x_page, light_position_y_page, light_position_z_page],
                                     None, _js="moveLight3DModel")
        light_position_y_page.change(None, [light_position_x_page, light_position_y_page, light_position_z_page],
                                     None, _js="moveLight3DModel")
        light_position_z_page.change(None, [light_position_x_page, light_position_y_page, light_position_z_page],
                                     None, _js="moveLight3DModel")
        entry_type.change(None, [entry_type], None, _js="setEntryType3DModel")
        width_page.change(None, [width_page, height_page], None, _js="setCanvasSize3DModel")
        height_page.change(None, [width_page, height_page], None, _js="setCanvasSize3DModel")
        model_scale_page.change(None, [model_scale_page], None, _js="updateModel3DModel")
        has_ground_page.change(None, [has_ground_page], None, _js="setGroundVisible3DModel")
        multi_files_checkbox.change(None, [multi_files_checkbox], None, _js="setMultiFiles3DModel")
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
    section = ('3dmodel', "3D Model")
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
