import React, {useState} from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import {Accordion, AccordionSummary, AccordionDetails, Button} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

let _animationProgress;

export function setAnimationProgress(animationProgress) {
    _animationProgress = animationProgress;

    //TODO need update progress bar here
}

function AnimationPanel({setAnimationPlaying, setAnimationStopPlaying, controlAnimation}) {
    const [value, setValue] = useState(0);

    return (
        <div>
            <Box mb={1} mt={1}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        Animation
                    </AccordionSummary>
                    <AccordionDetails>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                            if (setAnimationPlaying) {
                                setAnimationPlaying();
                            }
                        }}>Play/Pause</Button>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                                onClick={setAnimationStopPlaying}>Stop</Button>
                        <Box width="100%">
                            <Slider min={0} max={100}
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                        controlAnimation(newValue);
                                    }}
                                    aria-labelledby="continuous-slider"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
}

export default AnimationPanel;
