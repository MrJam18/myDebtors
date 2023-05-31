import React from 'react';
import { LoadingButton } from '@mui/lab';
import { buttonStyles } from "../../constants/UI/button";
const ButtonInForm = ({ loading = true, onClick, formId, text = 'Подтвердить', customClassName, type = 'submit' }) => {
    const classes = buttonStyles();
    return (<div className={classes.main}>
        <LoadingButton loading={loading} onClick={onClick} type={type} form={formId} variant='contained' className={classes.button + ' ' + customClassName}>{text} </LoadingButton>
        </div>);
};
export default ButtonInForm;
