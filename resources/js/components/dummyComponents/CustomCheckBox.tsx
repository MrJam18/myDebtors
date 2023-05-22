import React from 'react';
import {Checkbox, FormControlLabel} from "@mui/material";
import {standardFontSize} from "../../utils/standardFontSize";


const CustomCheckBox = ({size='small', label = null, className = null, checked = null, setChecked = null, onChange = null, name = null, inputProps = null, tabIndex = null}) => {

 const checkBoxHandler = (ev) => {
  setChecked(ev.target.checked);
  if(onChange) onChange(ev.target.checked);
 }


 return (
  <>
    {/*
 // @ts-ignore */}
   <FormControlLabel inputProps={inputProps} onChange={checkBoxHandler} defaultChecked={checked} control={<Checkbox size={size} tabIndex={tabIndex} />} sx={{ '& .MuiTypography-root': standardFontSize}} label={label} className={className} checked={checked} name={name} />
  </>
 );
};

export default CustomCheckBox;