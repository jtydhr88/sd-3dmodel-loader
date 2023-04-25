import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import {Button} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function SendToControlNetPanel({options, onValueChange, setRendererImage, sendImage}) {
    const [selectedValue, setSelectedValue] = useState('');

    return (
        <div>
            <Box mb={1} mt={1}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        Send To ControlNet
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl variant="outlined" fullWidth sx={{margin: '2px'}}>
                            <InputLabel htmlFor="dropdown-list">Select an option</InputLabel>
                            <Select
                                value={selectedValue}
                                onChange={(event) => {
                                    setSelectedValue(event.target.value);
                                    if (onValueChange) {
                                        onValueChange(event.target.value);
                                    }
                                }}
                                label="ControlNet Index"
                                inputProps={{
                                    name: 'dropdown-list',
                                    id: 'dropdown-list',
                                }}
                            >
                                {options.map((option, index) => (
                                    <MenuItem key={index} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                            setRendererImage(sendImage, selectedValue, 'txt2img');
                        }}>Send to txt2img</Button>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                            setRendererImage(sendImage, selectedValue, 'img2img');
                        }}>Send to img2img</Button>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
}
