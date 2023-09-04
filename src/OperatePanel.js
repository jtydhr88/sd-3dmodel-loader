import React, {useState} from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import {
    FormControl,
    RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {setOperateMode} from "./ThreeJsScene";

function OperatePanel({setOperateMode}) {
    const [mode, setMode] = useState("none");
    const modes = [
        {label: "None", value: "none"},
        {label: "Translate", value: "translate"},
        {label: "Rotate", value: "rotate"}
    ];

    return (<div>
            <Box mb={1} mt={1}>
                <Box width="100%">
                    <FormControl variant="outlined" fullWidth sx={{margin: '2px'}}>
                        <InputLabel htmlFor="dropdown-list">Operate</InputLabel>
                        <Select
                            value={mode}
                            onChange={(event) => {
                                setMode(event.target.value);
                                setOperateMode(event.target.value);
                            }}
                            label="Operate"
                            inputProps={{
                                name: 'dropdown-list',
                                id: 'dropdown-list',
                            }}
                        >
                            {modes.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </div>
    );
}

export default OperatePanel;
