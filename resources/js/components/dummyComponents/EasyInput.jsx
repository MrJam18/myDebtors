import React, { useEffect, useRef } from 'react';
import { TextField } from "@mui/material";
import { capitalizeFirstLetter } from "../../utils/text/capitalize";
import { moreThenNow } from "../../utils/moreThenNow";
const EasyInput = React.forwardRef(({ editable = true, label = null, name, className, type = 'text', autoFocus = false, required = false, pattern = null, defaultValue = null, disabled = false, variant = 'standard', size = 'medium', onBlur = null, shrink = undefined, isFocused = false }, ref) => {
    label = label ? capitalizeFirstLetter(label) : null;
    const inputRef = useRef();
    let suggestionsHandler;
    let currentPattern;
    if (pattern === 'float') {
        suggestionsHandler = (ev) => {
            const input = ev.target;
            if (input.validity.patternMismatch) {
                input.setCustomValidity('Укажите данные в формате ч.чч, ч,чч или ч, где ч - это число');
            }
            else
                input.setCustomValidity('');
        };
        currentPattern = "^[0-9]+[\.,][0-9]{1,2}$|^[0-9]+$";
    }
    else if (type === 'date' && pattern === 'lessThenNow') {
        suggestionsHandler = (ev) => {
            const input = ev.target;
            if (moreThenNow(input.value)) {
                input.setCustomValidity('дата не может быть больше текущей!');
            }
            else
                input.setCustomValidity('');
        };
    }
    useEffect(() => {
        // @ts-expect-error TS(2339): Property 'current' does not exist on type 'Forward... Remove this comment to see the full error message
        if (ref)
            ref.current = inputRef.current;
    }, [inputRef.current]);
    return (<TextField disabled={disabled || !editable} autoFocus={autoFocus} onBlur={onBlur} defaultValue={defaultValue} label={label} onChange={suggestionsHandler} inputProps={{ pattern: currentPattern }} inputRef={inputRef} variant={variant} required={required} InputLabelProps={{ shrink: type === 'date' ? true : shrink }} className={className} name={name} fullWidth type={type} size={size}/>);
});
export default EasyInput;
