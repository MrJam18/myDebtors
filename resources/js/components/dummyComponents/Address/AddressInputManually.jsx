import React from 'react';
import { useDispatch } from "react-redux";
import { TextField } from "@mui/material";
import styles from '../../../css/adress.module.css';
const AddressInputManually = ({ onChange }) => {
    const dispatch = useDispatch();
    return (<div className={styles.inputManually}>
            // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'string'.
            <TextField onChange={onChange} label={'123'}/>
        </div>);
};
export default AddressInputManually;
