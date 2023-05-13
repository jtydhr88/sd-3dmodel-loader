import React, {useState} from "react";
import {
    Button,
    TextField
} from '@mui/material';

const NumberInput = () => {
    const [value, setValue] = useState(0);

    const handleDecrease = () => {
        setValue(value - 1);
    };

    const handleIncrease = () => {
        setValue(value + 1);
    };

    const handleChange = (event) => {
        const newValue = parseInt(event.target.value);
        if (!isNaN(newValue)) {
            setValue(newValue);
        }
    };

    const containerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    };

    return (
        <div style={containerStyle}>
            <Button onClick={handleDecrease}>-</Button>
            <TextField value={value} onChange={handleChange}/>
            <Button onClick={handleIncrease}>+</Button>
        </div>
    );
};

export default NumberInput;