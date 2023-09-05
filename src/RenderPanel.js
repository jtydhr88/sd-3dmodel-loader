import React, {useState} from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import {
    Typography,
    FormControl,
} from '@mui/material';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {FormattedMessage} from 'react-intl';

function RenderPanel({setRenderMode, setDepthContrast}) {
    const [mode, setMode] = useState("none");
    const modes = [
        {labelId: "none", value: "none"},
        {labelId: "depth", value: "depth"},
        {labelId: "normal", value: "normal"}
    ];
    const [contrast, setContrast] = useState(0.5);

    return (<div>
        <Box mb={1} mt={1}>
            <Box width="100%">
                <FormControl variant="outlined" fullWidth sx={{margin: '2px'}}>
                    <InputLabel htmlFor="dropdown-list">
                        <FormattedMessage id="render" defaultMessage="Render"/>
                    </InputLabel>
                    <Select
                        value={mode}
                        onChange={(event) => {
                            setRenderMode(event.target.value);
                            setMode(event.target.value);
                        }}
                        label="Render"
                        inputProps={{
                            name: 'dropdown-list',
                            id: 'dropdown-list',
                        }}
                    >
                        {modes.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                                <FormattedMessage id={option.labelId}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {
                    mode === "depth" && <Box width="100%">
                        <Typography gutterBottom>
                            <FormattedMessage id="depth-contrast" defaultMessage="Depth Contrast"/>
                        </Typography>
                        <Slider min={0.05} max={0.95}
                                valueLabelDisplay="auto"
                                step={0.05}
                                value={contrast}
                                onChange={(event, newValue) => {
                                    setContrast(newValue);
                                    setDepthContrast(newValue);
                                }}
                                aria-labelledby="continuous-slider"
                        />
                    </Box>
                }
            </Box>
        </Box>
    </div>);
}

export default RenderPanel;
