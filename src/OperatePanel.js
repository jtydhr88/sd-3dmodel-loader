import React, {useState} from 'react';
import Box from '@mui/material/Box';
import {
    FormControl,
} from '@mui/material';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {FormattedMessage} from 'react-intl';

function OperatePanel({setOperateMode}) {
    const [mode, setMode] = useState("none");
    const modes = [
        {labelId: "none", value: "none"},
        {labelId: "translate", value: "translate"},
        {labelId: "rotate", value: "rotate"}
    ];

    return (<div>
            <Box mb={1} mt={1}>
                <Box width="100%">
                    <FormControl variant="outlined" fullWidth sx={{margin: '2px'}}>
                        <InputLabel htmlFor="dropdown-list">
                            <FormattedMessage id="operate" defaultMessage="Operate"/>
                        </InputLabel>

                        <Select
                            value={mode}
                            onChange={(event) => {
                                setMode(event.target.value);
                                setOperateMode(event.target.value);
                            }}
                            label="Operate"
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
                </Box>
            </Box>
        </div>
    );
}

export default OperatePanel;
