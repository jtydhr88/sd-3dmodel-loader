import React, {useState} from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function RenderPanel({setRenderMode, setDepthContrast}) {
    const [mode, setMode] = useState("none");
    const modes = [
        {label: "None", value: "none"},
        {label: "Depth", value: "depth"},
        {label: "Normal", value: "normal"}
    ];
    const [contrast, setContrast] = useState(0.5);

    return (<div>
        <Box mb={1} mt={1}>
            <Box width="100%">
                <FormControl variant="outlined" fullWidth sx={{margin: '2px'}}>
                    <InputLabel htmlFor="dropdown-list">Render</InputLabel>
                    <Select
                        value={mode}
                        onChange={(event) => {
                            setRenderMode(event.target.value);
                            setMode(event.target.value);
                        }}
                        label="Render"
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
                {
                    mode === "depth" && <Box width="100%">
                        <Typography gutterBottom>Depth Contrast</Typography>
                        <Slider min={0.05} max={0.95}
                                valueLabelDisplay="auto"
                                step={0.05}
                                value={contrast}
                                onChange={(event, newValue) => {
                                    setContrast(newValue);
                                    setDepthContrast(newValue);
                                }}
                                aria-labelledby="continuous-slider"
                        />
                    </Box>
                }
            </Box>
        </Box>
    </div>);
}

export default RenderPanel;
