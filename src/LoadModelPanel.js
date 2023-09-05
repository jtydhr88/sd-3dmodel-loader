import React from 'react';
import Box from '@mui/material/Box';
import {Button} from "@mui/material";

export default function LoadModelPanel({
                                           setPoseModelFileName, modelName, labelName
                                       }) {
    const loadPoseModel = () => {
        setPoseModelFileName(modelName);
    };

    return (<div>
        <Box mb={1} mt={1}>

            <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                    onClick={loadPoseModel}>{labelName}</Button>
        </Box>
    </div>);
}
