import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
const standardFontSize = {
    fontSize: '16px'
};
const EasyCheckBox = ({ name, onChange, defaultValue = false, className = null, size = 'medium', rootStyles = standardFontSize, tabIndex = null, label }) => {
    const [value, setValue] = useState(defaultValue ? 't' : 'f');
    const [checked, setChecked] = useState(defaultValue);
    const ref = useRef();
    const onChangeChecked = (ev) => {
        let targetChecked = ev.target.checked;
        if (ev.isTrusted)
            targetChecked = !targetChecked;
        setValue(targetChecked ? 't' : 'f');
        setChecked(targetChecked);
        if (onChange)
            onChange(targetChecked, ev);
    };
    useEffect(() => {
        ref.current.addEventListener('change', onChangeChecked);
        return () => {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('change', onChangeChecked);
        };
    }, []);
    return (<>
            {/*
// @ts-ignore */}
            <FormControlLabel control={<Checkbox inputRef={ref} value={value} checked={checked} size={size} tabIndex={tabIndex} name={name}/>} sx={{ '& .MuiTypography-root': rootStyles }} label={label} className={className}/>
        </>);
};
export default EasyCheckBox;
