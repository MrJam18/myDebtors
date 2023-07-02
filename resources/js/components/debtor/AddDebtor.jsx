import { makeStyles } from '@mui/styles';
import React from 'react';
import styles from '../../css/addDebtor.module.css';
import { useState } from 'react';
import { useRef } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import CustomModal from "../dummyComponents/CustomModal";
import { AddDebtorDispatcher } from "../../store/Dispatchers/Debtor/AddDebtorDispatcher";
import Debtor from "./Debtor";
const useStyles = makeStyles({
    button: {
        width: '50%',
        height: '35px',
    },
});
const AddDebtor = ({ setShow, updateList }) => {
    const classes = useStyles();
    const [addressForDB, setAddressForDB] = useState();
    const [loading, setLoading] = useState(false);
    const debtorForm = useRef();
    const [error, setError] = useState(false);
    const formHandler = async (ev) => {
        ev.preventDefault();
        const dispatcher = new AddDebtorDispatcher(setError, setLoading, debtorForm);
        // dispatcher.data.passportType = passportType;
        dispatcher.data.address = addressForDB;
        await dispatcher.handle();
        setShow(false);
        updateList();
    };
    return (
    <CustomModal header={'Создание должника'} show={true} customStyles={{ width: '40%', minWidth: '465px', maxWidth: '500px' }} setShow={setShow}>
        <form onSubmit={formHandler} ref={debtorForm}>
            <Debtor setAddressForDB={setAddressForDB} defaultValues={{type_id: 1}} />
            <div className='button_submit'><LoadingButton loading={loading} variant="contained" size="large" type='submit' className={classes.button}>
          Подтвердить
            </LoadingButton></div>
            {error && <div className={styles.error}>{error}</div>}
        </form>
        </CustomModal>);
};
export default AddDebtor;
//# sourceMappingURL=AddDebtor.jsx.map