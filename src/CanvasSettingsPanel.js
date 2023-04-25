import React, {useState} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {SketchPicker} from 'react-color';
import {Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from '@mui/material/Box';

function CanvasSettingsPanel({setCanvasBgColor, setCanvasGround, setCanvasGrid, setCanvasAxis}) {
    const [bgColorChecked, setBgColorChecked] = useState(false);
    const [bgColor, setBgColor] = useState();
    const [groundChecked, setGroundChecked] = useState(true);
    const [axisChecked, setAxisChecked] = useState(true);
    const [gridChecked, setGridChecked] = useState(true);

    return (
        <div>
            <Box mb={1} mt={1}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        Canvas
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={bgColorChecked}
                                    onChange={(event) => {
                                        setBgColorChecked(event.target.checked);
                                    }}
                                    color="primary"
                                />
                            }
                            label={'Background Color'}
                        />
                        {bgColorChecked && (
                            <SketchPicker
                                color={bgColor}
                                onChangeComplete={(color) => {
                                    setBgColor(color);
                                    setCanvasBgColor(color);
                                }}
                                disableAlpha={true}
                            />
                        )}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={groundChecked}
                                    onChange={(event) => {
                                        setGroundChecked(event.target.checked);

                                        if (setCanvasGround) {
                                            setCanvasGround(event.target.checked);
                                        }
                                    }}
                                    color="primary"
                                />
                            }
                            label='Ground'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={gridChecked}
                                    onChange={(event) => {
                                        setGridChecked(event.target.checked);
                                        setCanvasGrid(event.target.checked)
                                    }}
                                    color="primary"
                                />
                            }
                            label='Grid'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={axisChecked}
                                    onChange={(event) => {
                                        setAxisChecked(event.target.checked);
                                        setCanvasAxis(event.target.checked)
                                    }}
                                    color="primary"
                                />
                            }
                            label='Axis'
                        />
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
}

export default CanvasSettingsPanel;
