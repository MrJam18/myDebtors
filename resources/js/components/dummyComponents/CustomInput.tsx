import React, {useEffect, useRef} from 'react';
import TextField from "@mui/material/TextField";
import {capitalizeFirstLetter} from "../../utils/text/capitalize";
import {validityHandler} from "../../utils/inputs/validityHandler";

let suggestionsHandler = null;

// @ts-expect-error TS(2339): Property 'autofocus' does not exist on type '{ chi... Remove this comment to see the full error message
const CustomInput = React.forwardRef(({autofocus = false, disabled= false, defaultValue=null, label, pattern=null, variant='standard', required=true, type, size, fullwidth=true, className, name, customValidity, noSubmit = false}, ref) => {
  label = capitalizeFirstLetter(label);
  const noSubmitHandler = (ev) => {
      if(ev.code === 'Enter') ev.preventDefault();
  }
  const inputRef = useRef();
  useEffect(() => {
        // @ts-expect-error TS(2339): Property 'current' does not exist on type 'Forward... Remove this comment to see the full error message
        if(ref) ref.current = inputRef.current;
    }, [inputRef.current]);
  useEffect(()=> {
      if(customValidity) {
          const input = inputRef.current;
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          input.removeEventListener('change', suggestionsHandler);
          suggestionsHandler = () => validityHandler(input, customValidity);
          validityHandler(input, customValidity);
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          input.addEventListener('change', suggestionsHandler);
      }
  }, [customValidity])
 return (
  <TextField onKeyDown={noSubmit ? noSubmitHandler : null} autoFocus={autofocus} disabled={disabled} defaultValue={defaultValue} label={label} inputProps={{pattern}} inputRef={inputRef} variant={variant} required={required} InputLabelProps={type === 'date' ? { shrink: true } : null} className={className} name={name} fullWidth type={type} size={size} />
 );
});

export default CustomInput;