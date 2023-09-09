import React, {useState} from 'react';
import Box from '@mui/material/Box';
import {Button, Grid} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {loadPoseModel} from "./ThreeJsScene";
import gestures from "./HandPanel/gestures.json";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function LoadModelPanel({
                                           configs,
                                           setPoseModelFileName, modelNames, labelName
                                       }) {

    const [selectedModel, setSelectedModel] = useState(Object.keys(modelNames)[0]);

    const loadPoseModel = (modelName) => {
        setPoseModelFileName(configs.resourcePath, modelNames[modelName]);
    };

    return (<div>
        <Grid container spacing={2}>
            <Grid item xs={7}>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                            loadPoseModel(selectedModel);
                        }}
                    >
                        {labelName}
                    </Button>
                </Box>
            </Grid>

            <Grid item xs={5}>
                <Select
                    labelId="model-select-label"
                    value={selectedModel}
                    onChange={(event) => {
                        setSelectedModel(event.target.value)
                    }}
                    label="model-list"
                >
                    {Object.entries(modelNames).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                            <FormattedMessage id={key}/>
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>

    </div>);
}
