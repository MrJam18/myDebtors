import React, {useState} from "react"
import styles from "../../../css/contract.module.css";
import {Button} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AddPayment from "./AddPayment";
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    grid: {
        height: 'auto',
        width: '50%',
        justifyContent: 'flex-end'
    },
    modal: {
        position: 'absolute',

    },
    button: {
        marginTop: '15px',
        width: '40%'
    },
    addPayment__input: {
        marginTop: '10px'
    },
    payments__toolBarButton: {
        width: 'auto'
    }
})

function Toolbar({update}) {
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const buttonHandler = () => {
        setModal(true);
    }
    return (
        <div className={styles.payments__toolbar}>
            <Button variant="text" onClick={buttonHandler} className={classes.payments__toolBarButton}><FontAwesomeIcon icon={solid('plus')} className={styles.payments__addIcon}/> Добавить</Button>
            { modal && <AddPayment update={update} setModal={setModal} /> }
        </div>
    );
}

export default Toolbar