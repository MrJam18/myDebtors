import {Checkbox, FormControlLabel, SxProps} from "@mui/material";
import React, {useEffect, useState} from "react";
import {standardFontSize} from "../../utils/standardFontSize";

type Props = {
    size?: 'small' | 'medium',
    label: string,
    className?: string,
    defaultValue?: boolean,
    onChange?:  (state: boolean) => void,
    name: string,
    tabIndex?: number,
    rootStyles?: SxProps
}

const EasyCheckBox = ({
    name,
    onChange,
    defaultValue = false,
    className = null,
    size='small',
    rootStyles= standardFontSize,
    tabIndex = null,
    label
                      }: Props) => {
    const [value, setValue] = useState('f');
    const [checked, setChecked] = useState(defaultValue);
    const onChangeChecked = (ev: React.SyntheticEvent) => {
        const target = ev.target as HTMLInputElement;
        setValue(target.checked ? 't' : 'f');
        setChecked(target.checked);
        if(onChange) onChange(target.checked);
    }
    useEffect(() => {
        setValue(defaultValue ? 't' : 'f');
        setChecked(defaultValue);
    }, [defaultValue]);
    return (
        <>
            {/*
// @ts-ignore */}
            <FormControlLabel onChange={onChangeChecked} checked={checked} defaultChecked={defaultValue} control={<Checkbox size={size} value={value} tabIndex={tabIndex} />} sx={{ '& .MuiTypography-root': rootStyles}} label={label} className={className} name={name} />
        </>
    );
}

export default EasyCheckBox