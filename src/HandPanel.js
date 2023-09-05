import React, {useRef, useState} from 'react';
import {
    Button,
    FormControlLabel
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from "@mui/material/Checkbox";

export default function HandPanel({
                                      showHandBones,
                                      exportBonesJSON, importBonesJSON
                                  }) {
    const [visible, setVisible] = useState(true);
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
                label='Show hand bones'
            />
            <Button variant="contained" color="primary" fullWidth sx={{margin: '2px'}}
                    onClick={() => {
                        exportBonesJSON("hand");
                    }}>Export Gesture JSON</Button>
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
                Import Gesture JSON
            </Button>
        </Box>
    </div>);
}