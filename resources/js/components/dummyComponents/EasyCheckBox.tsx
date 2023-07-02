import {Checkbox, FormControlLabel, SxProps} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";

const standardFontSize = {
    fontSize: '16px'
}


type Props = {
    size?: 'small' | 'medium',
    label: string,
    className?: string,
    defaultValue?: boolean,
    onChange?:  (state: boolean, ev: InputEvent) => void,
    name: string,
    tabIndex?: number,
    rootStyles?: SxProps
}

const EasyCheckBox = ({
    name,
    onChange,
    defaultValue = false,
    className = null,
    size='medium',
    rootStyles= standardFontSize,
    tabIndex = null,
    label
                      }: Props) => {
    const [value, setValue] = useState(defaultValue ? 't' : 'f');
    const [checked, setChecked] = useState(defaultValue);
    const ref = useRef<HTMLInputElement>();
    const onChangeChecked = (ev: InputEvent) => {
        let targetChecked = (ev.target as HTMLInputElement).checked;
        if(ev.isTrusted) targetChecked = !targetChecked;
        setValue(targetChecked ? 't' : 'f');
        setChecked(targetChecked);
        if(onChange) onChange(targetChecked, ev);
    }
    useEffect(()=> {
        ref.current.addEventListener('change', onChangeChecked);
        return ()=> {
            ref.current?.removeEventListener('change', onChangeChecked);
        }
    }, [])
    return (
        <>
            {/*
// @ts-ignore */}
            <FormControlLabel control={<Checkbox inputRef={ref} value={value} checked={checked} size={size} tabIndex={tabIndex} name={name} />} sx={{ '& .MuiTypography-root': rootStyles}} label={label} className={className} />
        </>
    );
}

export default EasyCheckBox