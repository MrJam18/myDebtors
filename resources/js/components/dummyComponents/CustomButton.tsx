import React from 'react';
import Button from '@mui/material/Button';
import {buttonStyles} from "../../constants/UI/button";
import {ButtonType} from "../../Types/ButtonType";

type Props = {
    onClick?: Function,
    formId?: string,
    text?: string,
    type?: ButtonType
}

const CustomButton = ({onClick = null, formId, text = 'Подтвердить', type='submit'}: Props) => {
 const classes = buttonStyles();
 return (
     <div className={classes.main}>
         {/*
         // @ts-ignore */}
      <Button onClick={onClick} type={type} form={formId} variant='contained' className={classes.button}>{text} </Button>
     </div>
 );
};

export default CustomButton;