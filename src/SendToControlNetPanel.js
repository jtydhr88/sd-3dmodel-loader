import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import {Button} from "@mui/material";

export default function SendToControlNetPanel({configs, setRendererImage, sendImage, downloadRendererImage}) {
    const [selectedValue, setSelectedValue] = useState('');

    const generateControlNetOptions = () => {
        const options = [];
        for (let i = 0; i < configs.controlNetNum; i++) {
            const option = {value: i.toString(), label: i.toString()};

            options.push(option);
        }

        return options;
    }

    return (
        <div>
            <Box mb={1} mt={1}>
                <FormControl variant="outlined" fullWidth sx={{margin: '2px'}}>
                    <InputLabel htmlFor="dropdown-list">Select an option</InputLabel>
                    <Select
                        value={selectedValue}
                        onChange={(event) => {
                            setSelectedValue(event.target.value);
                        }}
                        label="ControlNet Index"
                        inputProps={{
                            name: 'dropdown-list',
                            id: 'dropdown-list',
                        }}
                    >
                        {generateControlNetOptions().map((option, index) => (
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
