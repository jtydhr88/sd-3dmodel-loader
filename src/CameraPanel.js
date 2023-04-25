import React, {useState} from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import {Accordion, AccordionSummary, AccordionDetails, Typography} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function CameraPanel({setCameraNear, setCameraFar, setCameraFOV}) {
    const [far, setFar] = useState(1000);
    const [near, setNear] = useState(0.1);
    const [fov, setFOV] = useState(45);

    return (<div>
        <Box mb={1} mt={1}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    Camera
                </AccordionSummary>
                <AccordionDetails>
                    <Box width="100%">
                        <Typography gutterBottom>Near</Typography>
                        <Slider min={0.1} max={100}
                                valueLabelDisplay="auto"
                                step={0.1}
                                value={near}
                                onChange={(event, newValue) => {
                                    setNear(newValue);
                                    setCameraNear(newValue);
                                }}
                                aria-labelledby="continuous-slider"
                        />
                        <Typography gutterBottom>Far</Typography>
                        <Slider min={0.1} max={20000}
                                valueLabelDisplay="auto"
                                value={far}
                                onChange={(event, newValue) => {
                                    setFar(newValue);
                                    setCameraFar(newValue)
                                }}
                                aria-labelledby="continuous-slider"
                        />
                        <Typography gutterBottom>FOV</Typography>
                        <Slider min={1} max={100}
                                valueLabelDisplay="auto"
                                value={fov}
                                onChange={(event, newValue) => {
                                    setFOV(newValue);
                                    setCameraFOV(newValue);
                                }}
                                aria-labelledby="continuous-slider"
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    </div>);
}

export default CameraPanel;
