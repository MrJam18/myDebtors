import React from 'react';
import EasySearch from "./EasySearch";
import styles from "../../../css/searchAndAddButton.module.css";
import AddIcon from "@mui/icons-material/Add";
import {Fab} from "@mui/material";

type Props = {
    label?: string,
    customStyles?: React.CSSProperties,
    serverAddress: string,
    delay?: number,
    setValue: React.Dispatch<React.SetStateAction<{
        id: number,
        name: string
    }>>,
    value?: {
        id: number,
        name: string
    },
    required?: boolean,
    disabled?: boolean,
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>,
    className?: string,
    onClickAddButton: React.MouseEventHandler
}

const SearchAndAddButton = ({label, value = null, required = false, serverAddress, onClickAddButton, setValue, customStyles, disabled = false, onKeyDown = null, className = null, delay = 300}: Props) => {

    return (
        <div style={customStyles} className={styles.main + (className ? ' ' + className : '')}>
           <EasySearch disabled={disabled} onKeyDown={onKeyDown} delay={delay} label={label} value={value} required={required} serverAddress={serverAddress} customStyles={{width: '93%'}} setValue={setValue} />
            <Fab size="small" type={'button'} onClick={onClickAddButton} color='primary' className={styles.addChipButton} aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    );
};

export default SearchAndAddButton;