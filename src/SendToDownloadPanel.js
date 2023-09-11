import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import {Accordion, AccordionDetails, AccordionSummary, Button} from "@mui/material";
import {FormattedMessage} from "react-intl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function SendToDownloadPanel({
                                                  configs,
                                                  setRendererImage,
                                                  sendImage,
                                                  downloadRendererImage,
                                                  sendRendererImageToCanvasEditor,
                                                  downloadOpenposeJSON
                                              }) {
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
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <FormattedMessage id="send-to-download" defaultMessage="Send To/Download"/>
                </AccordionSummary>
                <AccordionDetails>
                    <Box mb={1} mt={1}>
                        <FormControl variant="outlined" fullWidth sx={{margin: '2px'}}>
                            <InputLabel htmlFor="dropdown-list">
                                <FormattedMessage id="select-an-option" defaultMessage="Select an option"/>
                            </InputLabel>
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
                        }}><FormattedMessage id="send-to-txt2img" defaultMessage="Send to txt2img"/></Button>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                            setRendererImage(sendImage, selectedValue, 'img2img');
                        }}><FormattedMessage id="send-to-img2img" defaultMessage="Send to img2img"/></Button>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                            downloadRendererImage();
                        }}><FormattedMessage id="download" defaultMessage="Download"/></Button>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                            sendRendererImageToCanvasEditor();
                        }}><FormattedMessage id="send-to-canvas-editor"
                                             defaultMessage="Send To Canvas Editor"/></Button>
                        <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}} onClick={() => {
                            downloadOpenposeJSON();
                        }}><FormattedMessage id="download-openpose-json"
                                             defaultMessage="Download Openpose JSON"/></Button>

                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
