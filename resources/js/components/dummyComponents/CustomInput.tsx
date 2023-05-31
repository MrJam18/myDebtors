``
import React, {useEffect, useRef} from 'react';
import TextField, {BaseTextFieldProps, } from "@mui/material/TextField";
import {useForwardRef} from "../../hooks/useForwardRef";
import {MUITextFieldVariant} from "../../Types/Mui/MUITextFieldVariant";
import {capitalizeFirstLetter} from "../../utils/text/capitalize";
import {validityHandler} from "../../utils/inputs/validityHandler";

let suggestionsHandler = null;

type Props = {
    autofocus?: boolean,
    disabled?: boolean,
    defaultValue?: string,
    label: string,
    pattern?: string,
    variant?: MUITextFieldVariant,
    required?: boolean,
    type?: BaseTextFieldProps["type"],
    size?: BaseTextFieldProps["size"],
    fullwidth?: boolean,
    className?: string,
    customValidity?: string,
    noSubmit?: boolean,
    placeholder?: string,
    name?: string,
    onEnter?: (ev: InputEvent) => void
}


const CustomInput = React.forwardRef<HTMLInputElement, Props>(({autofocus = false, disabled= false, defaultValue=null, label, pattern=null, variant='standard', required=true, type = 'text', size = null, fullwidth=true, className=null, name=null, customValidity=null, noSubmit = false, onEnter=null, placeholder=null,}: Props, ref) => {
  label = capitalizeFirstLetter(label);
  const onKeyDown = (ev) => {
      if(ev.keyCode === 13) {
          if(noSubmit) ev.preventDefault();
          if(onEnter) onEnter(ev);
      }
  }
    const inputRef = useForwardRef(ref);
  useEffect(()=> {
      if(customValidity) {
          const input = inputRef.current;
          input.removeEventListener('change', suggestionsHandler);
          suggestionsHandler = () => validityHandler(input, customValidity);
          validityHandler(input, customValidity);
          input.addEventListener('change', suggestionsHandler);
      }
  }, [customValidity])
    // @ts-ignore
 return (
  <TextField placeholder={placeholder} onKeyDown={onKeyDown} autoFocus={autofocus} disabled={disabled} defaultValue={defaultValue} label={label} inputProps={{pattern}} inputRef={inputRef} variant={variant} required={required} InputLabelProps={type === 'date' ? { shrink: true } : null} className={className} name={name} fullWidth type={type} size={size} />
 );
});

export default CustomInput;``