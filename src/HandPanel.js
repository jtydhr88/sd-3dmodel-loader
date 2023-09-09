import React, {useRef, useState} from 'react';
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Button, FormControl,
    FormControlLabel
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from "@mui/material/Checkbox";
import {FormattedMessage} from "react-intl";
import gestures from './HandPanel/gestures.json';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function HandPanel({
                                      configs,
                                      showHandBones,
                                      exportBonesJSON, importBonesJSON
                                  }) {
    const [visible, setVisible] = useState(true);
    const [gesture, setGesture] = useState("default");
    const inputFileRef = useRef(null);

    const handleFileUpload = event => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const jsonContent = JSON.parse(e.target.result);

                importBonesJSON("hand", jsonContent);
            };
            reader.readAsText(file);
        }
    };
    return (<div>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <FormattedMessage id="hand" defaultMessage="Hand"/>
            </AccordionSummary>
            <AccordionDetails>
                <Box mb={1} mt={1}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={visible}
                                onChange={(event) => {
                                    showHandBones(event.target.checked);

                                    setVisible(event.target.checked);
                                }}
                                color="primary"
                            />
                        }
                        label={<FormattedMessage id="show-hand-bones" defaultMessage="Show hand bones"/>}
                    />
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="gesture-select-label">Gesture Lib</InputLabel>
                        <Select
                            labelId="gesture-select-label"
                            value={gesture}
                            onChange={(event) => {
                                const selectedValue = event.target.value;
                                if (selectedValue !== "default") {
                                    const path = configs.resourcePath + "gestures/" + gestures[event.target.value];

                                    fetch(path)
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            return response.json();
                                        })
                                        .then(data => {
                                            importBonesJSON("hand", data);
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });
                                }

                                setGesture(event.target.value)
                            }}
                            label="Gesture"
                        >
                            <MenuItem value="default"><FormattedMessage id="default"/></MenuItem>
                            {Object.entries(gestures).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    <FormattedMessage id={key}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                            onClick={() => {
                                exportBonesJSON("hand");
                            }}><FormattedMessage id="export-gesture-json"
                                                 defaultMessage="Export Gesture JSON"/></Button>
                    <input
                        type="file"
                        accept=".json"
                        style={{display: 'none'}}
                        ref={inputFileRef}
                        onChange={handleFileUpload}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{margin: '2px'}}
                        onClick={() => inputFileRef.current.click()}
                    >
                        <FormattedMessage id="import-gesture-json" defaultMessage="Import Gesture JSON"/>
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    </div>);
}