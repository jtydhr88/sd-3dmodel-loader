import React from 'react';
import Box from '@mui/material/Box';
import {Button} from "@mui/material";

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
            <Box mb={1} mt={1}>
                <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                        onClick={loadSingleModel}>Load Model</Button>
            </Box>
        </div>
    );
}
