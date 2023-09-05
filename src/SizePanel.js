import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import {FormattedMessage} from "react-intl";

export default function SizePanel({setPreviewSize}) {
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
                    <InputLabel htmlFor="dropdown-list">
                        <FormattedMessage id="size" defaultMessage="Size"/>
                    </InputLabel>
                    <Select
                        value={sizeValue}
                        onChange={(event) => {
                            setSizeValue(event.target.value);
                            if (setPreviewSize) {
                                setPreviewSize(event.target.value);
                            }
                        }}
                        label="Size"
                        inputProps={{
                            name: 'dropdown-list',
                            id: 'dropdown-list',
                        }}
                    >
                        {sizes.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </div>
    );
}
