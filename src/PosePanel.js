import React, {useState} from 'react';
import {
    FormControlLabel
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from "@mui/material/Checkbox";

export default function PosePanel({
                                      showBodyBones
                                  }) {
    const [visible, setVisible] = useState(true);
    return (<div>
        <Box mb={1} mt={1}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={visible}
                        onChange={(event) => {
                            showBodyBones(event.target.checked);

                            setVisible(event.target.checked);
                        }}
                        color="primary"
                    />
                }
                label='Show body bones'
            />
        </Box>
    </div>);
}