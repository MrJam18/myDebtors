import React from 'react';
import EasySearch from "./EasySearch";
import styles from "../../../css/searchAndAddButton.module.css";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
const SearchAndAddButton = ({ label, value = null, required = false, serverAddress, onClickAddButton, setValue, customStyles, disabled = false, onKeyDown = null, className = null, delay = 300 }) => {
    return (<div className={styles.main}>
           <EasySearch disabled={disabled} className={className} onKeyDown={onKeyDown} delay={delay} label={label} value={value} required={required} serverAddress={serverAddress} customStyles={customStyles !== null && customStyles !== void 0 ? customStyles : { width: '93%' }} setValue={setValue}/>
            <Fab size="small" type={'button'} onClick={onClickAddButton} color='primary' className={styles.addChipButton} aria-label="add">
                <AddIcon />
            </Fab>
        </div>);
};
export default SearchAndAddButton;
