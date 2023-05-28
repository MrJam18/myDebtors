import React, {useEffect} from 'react';
import {Checkbox, FormControlLabel, SxProps} from "@mui/material";
import {standardFontSize} from "../../utils/standardFontSize";

type Props = {
 size?: 'small' | 'medium',
 label: string,
 className?: string,
 checked?: boolean,
 setChecked: React.Dispatch<React.SetStateAction<boolean>>,
 defaultChecked?: boolean,
 onChange?:  (state: boolean) => void,
 name?: string,
 inputProps?: Object,
 tabIndex?: number,
 rootStyles?: SxProps
}

const CustomCheckBox = ({size='small', rootStyles = standardFontSize, label = null, className = null, checked = undefined, setChecked = null, defaultChecked = false, onChange = null, name = null, inputProps = null, tabIndex = null}: Props) => {

 const checkBoxHandler = (ev) => {
  setChecked(ev.target.checked);
  if(onChange) onChange(ev.target.checked);
 }

 useEffect(()=> {
  if(defaultChecked !== null) setChecked(defaultChecked);
 }, []);


 return (
  <>
    {/*
 // @ts-ignore */}
   <FormControlLabel inputProps={inputProps} onChange={checkBoxHandler} defaultChecked={defaultChecked} control={<Checkbox size={size} tabIndex={tabIndex} />} sx={{ '& .MuiTypography-root': rootStyles}} label={label} className={className} checked={checked} name={name} />
  </>
 );
};

export default CustomCheckBox;