``;
import React, { useEffect, useMemo } from 'react';
import TextField from "@mui/material/TextField";
import { useForwardRef } from "../../hooks/useForwardRef";
import { capitalizeFirstLetter } from "../../utils/text/capitalize";
import { validityHandler } from "../../utils/inputs/validityHandler";
let suggestionsHandler = null;
const CustomInput = React.forwardRef(({ autofocus = false, disabled = false, defaultValue = null, label = null, pattern = null, variant = 'standard', required = true, type = 'text', size = null, fullwidth = true, className = null, name = null, customValidity = null, noSubmit = false, onEnter = null, placeholder = null, inputProps = null }, ref) => {
    const changedLabel = useMemo(() => {
        if (label)
            return capitalizeFirstLetter(label);
        else
            return null;
    }, [label]);
    const onKeyDown = (ev) => {
        if (ev.keyCode === 13) {
            if (noSubmit)
                ev.preventDefault();
            if (onEnter)
                onEnter(ev);
        }
    };
    const inputRef = useForwardRef(ref);
    useEffect(() => {
        if (customValidity) {
            const input = inputRef.current;
            input.removeEventListener('change', suggestionsHandler);
            suggestionsHandler = () => validityHandler(input, customValidity);
            validityHandler(input, customValidity);
            input.addEventListener('change', suggestionsHandler);
        }
    }, [customValidity]);
    // @ts-ignore
    return (<TextField placeholder={placeholder} onKeyDown={onKeyDown} autoFocus={autofocus} disabled={disabled} defaultValue={defaultValue} label={changedLabel} inputProps={Object.assign(Object.assign({}, inputProps), { pattern })} inputRef={inputRef} variant={variant} required={required} InputLabelProps={type === 'date' ? { shrink: true } : null} className={className} name={name} fullWidth type={type} size={size}/>);
});
export default CustomInput;
