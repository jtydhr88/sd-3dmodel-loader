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

export default function SendToControlNetPanel({options, onValueChange, setRendererImage, sendImage, downloadRendererImage}) {
    const [selectedValue, setSelectedValue] = useState('');
    const [sizeValue, setSizeValue] = useState('1:1');
    const sizes = [
        {label: "1:1", value: "1:1"},
        {label: "2:3", value: "2:3"},
        {label: "3:2", value: "3:2"}
    ];

    return (
        <div>
            <Box mb={1} mt={1}>
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
                <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                    downloadRendererImage();
                }}>Download</Button>

            </Box>
        </div>
    );
}
