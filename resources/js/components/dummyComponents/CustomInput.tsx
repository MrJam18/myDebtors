import React, {useEffect, useRef} from 'react';
import TextField, {BaseTextFieldProps} from "@mui/material/TextField";
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
  <TextField placeholder={placeholder} onKeyDown={onKeyDown} autoFocus={autofocus} disabled={disabled} defaultValue={defaultValue} label={label} inputProps={{pattern}} inputRef={inputRef} variant={variant} required={required} InputLabelProps={type === 'date' ? { shrink: true } : null} className={className} name={name} fullWidth type={type} size={size} />
 );
});

export default CustomInput;