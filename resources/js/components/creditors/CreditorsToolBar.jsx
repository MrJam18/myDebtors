import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import styles from '../../css/leftList.module.css';
import { makeStyles } from '@mui/styles';
import AddCreditor from './AddCreditor';
import ListSearcher from "../dummyComponents/search/ListSearcher";
import {useShow} from "../../hooks/useShow";

const useStyles = makeStyles({
     payments__toolBarButton: {
       width: 'auto'
     }
})


const CreditorsToolBar = ({setUpdate, setSearch}) => {
    const classes = useStyles();
    const showAddCreditor = useShow(AddCreditor, {setUpdate});
    return (
        <div className={styles.toolbar}>
            {showAddCreditor.Comp()}
            <ListSearcher setSearch={setSearch} />
            <Button variant="text" onClick={showAddCreditor.setTrue} className={classes.payments__toolBarButton}><FontAwesomeIcon icon={solid('plus')} className={styles.addIcon}/> Добавить</Button>
        </div>
    );
};

export default CreditorsToolBar;