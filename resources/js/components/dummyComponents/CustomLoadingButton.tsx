import React from 'react';
import {LoadingButton} from "@mui/lab";
import {buttonStyles} from "../../constants/UI/button";

const CustomLoadingButton = ({loading, type='button', onClick=()=>{}}) => {
    const classes = buttonStyles();
 return (
     <div className={classes.main}>
         {/*@ts-ignore*/}
        <LoadingButton loading={loading} className={classes.button} variant='contained' type={type} onClick={onClick} > Подтвердить </LoadingButton>
     </div>
 );
};

export default CustomLoadingButton;