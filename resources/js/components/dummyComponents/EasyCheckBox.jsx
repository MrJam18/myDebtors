import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
const standardFontSize = {
    fontSize: '16px'
};
const EasyCheckBox = ({ name, onChange, defaultValue = false, className = null, size = 'medium', rootStyles = standardFontSize, tabIndex = null, label }) => {
    const [value, setValue] = useState('f');
    const [checked, setChecked] = useState(defaultValue);
    const onChangeChecked = (ev) => {
        const target = ev.target;
        setValue(target.checked ? 't' : 'f');
        setChecked(target.checked);
        if (onChange)
            onChange(target.checked);
    };
    useEffect(() => {
        setValue(defaultValue ? 't' : 'f');
        setChecked(defaultValue);
    }, [defaultValue]);
    return (<>
            {/*
// @ts-ignore */}
            <FormControlLabel onChange={onChangeChecked} checked={checked} defaultChecked={defaultValue} control={<Checkbox size={size} value={value} tabIndex={tabIndex}/>} sx={{ '& .MuiTypography-root': rootStyles }} label={label} className={className} name={name}/>
        </>);
};
export default EasyCheckBox;
