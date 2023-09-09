import React from 'react';
import Box from '@mui/material/Box';
import {Button, Grid} from "@mui/material";
import {FormattedMessage} from 'react-intl';

export default function ModelPanel({setUploadedModelFile}) {
    const loadSingleModel = () => {
        const input = document.createElement("input");

        input.type = "file";
        input.accept = ".obj, .stl, .fbx, .gltf, .glb, .dae, .vrm";

        input.addEventListener("change", function (e) {
            const file = e.target.files[0];

            if (setUploadedModelFile) {
                setUploadedModelFile(file);
            }
        });

        input.click();
    };

    return (
        <div>

            <Button variant="contained" color="primary" fullWidth
                    onClick={loadSingleModel}><FormattedMessage id="load-model"
                                                                defaultMessage="Load Model"/></Button>


        </div>
    );
}
