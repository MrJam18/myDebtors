import React, {MouseEventHandler} from 'react';
import { LoadingButton } from '@mui/lab';
import {buttonStyles} from "../../constants/UI/button";
import {ButtonType} from "../../Types/ButtonType";

type Props = React.PropsWithoutRef<any> & {
    type?: ButtonType,
    loading?: boolean ,
    onClick?: MouseEventHandler,
    formId?: string ,
    customClassName?: string ,
    text?: string,
    disabled?: boolean,
    styles?: React.CSSProperties
}

const ButtonInForm = ({loading = true, onClick, disabled = false, formId, text='Подтвердить', customClassName, type='submit', styles  = null}: Props) => {
    const classes = buttonStyles();
    return (
        <div className={classes.main}>
        <LoadingButton style={styles} disabled={disabled} loading={loading} onClick={onClick} type={type} form={formId} variant='contained' className={classes.button + ' ' + customClassName}>{text} </LoadingButton>
        </div>    
    );
};

export default ButtonInForm;