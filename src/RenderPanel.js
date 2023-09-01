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

function RenderPanel({setRenderMode, setDepthContrast}) {
    const [mode, setMode] = useState("none");
    const [contrast, setContrast] = useState(0.5);

    return (<div>
        <Box mb={1} mt={1}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    Render
                </AccordionSummary>
                <AccordionDetails>
                    <Box width="100%">
                        <FormControl>
                            <FormLabel>Mode</FormLabel>
                            <RadioGroup
                                aria-labelledby="mode-radio-buttons-group-label"
                                defaultValue="none"
                                name="mode-radio-buttons-group"
                                row={true}
                                onChange={(event) => {
                                    setRenderMode(event.target.value);
                                    setMode(event.target.value);
                                }}
                            >
                                <FormControlLabel value="none" control={<Radio/>} label="None"
                                                  checked={mode === "none"}/>
                                <FormControlLabel value="depth" control={<Radio/>} label="Depth"
                                                  checked={mode === "depth"}/>
                                <FormControlLabel value="normal" control={<Radio/>} label="Normal"
                                                  checked={mode === "normal"}/>
                            </RadioGroup>
                            {
                                mode === "depth" && <Box width="100%">
                                    <Typography gutterBottom>Depth Contrast</Typography>
                                    <Slider min={0.1} max={1}
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            value={contrast}
                                            onChange={(event, newValue) => {
                                                setContrast(newValue);
                                                setDepthContrast(newValue);
                                            }}
                                            aria-labelledby="continuous-slider"
                                    />
                                </Box>
                            }
                        </FormControl>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    </div>);
}

export default RenderPanel;
