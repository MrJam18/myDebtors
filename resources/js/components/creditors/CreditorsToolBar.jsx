import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import styles from '../../css/orgs.module.css';
import { makeStyles } from '@mui/styles';
import AddCreditor from './AddCreditor';

const useStyles = makeStyles({
     payments__toolBarButton: {
       width: 'auto'
     }
})


const CreditorsToolBar = () => {
    const classes = useStyles();
    const [showAddOrg, setShowAddOrg] = useState(false);
    const addOrgClickHandler = () => {
        setShowAddOrg(true);
    }
    return (
        <div className={styles.toolbar}>
            <AddCreditor show={showAddOrg} setShow={setShowAddOrg} />
            <Button variant="text" onClick={addOrgClickHandler} className={classes.payments__toolBarButton}><FontAwesomeIcon icon={solid('plus')} className={styles.addIcon}/> Добавить</Button>
        </div>
    );
};

export default CreditorsToolBar;