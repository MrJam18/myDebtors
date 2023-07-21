import React, { useState } from 'react';
import styles from '../../../css/contract.module.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Warning from '../../dummyComponents/Warning';
import { Navigate, useParams } from 'react-router';
import api from "../../../http";
import {Alert} from "../../../classes/Alert";





const Toolbar = () => {
    const {contractId} = useParams();
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [navigate, setNavigate] = useState(false);
    const onClickDeleteButton = () => {
        setShowDeleteWarning(true)
    }
    const onSubmitDeleteContract = async () => {
        try {
            await api.delete('contracts/delete-one/' + contractId);
            setNavigate(true);
            Alert.set('Успешно', 'Договор успешно удален');
        }
        catch (e) {
            Alert.setError('Ошибка при удалении договора', e);
        }

    }
    if(navigate) {
        return <Navigate to='/list/contracts' replace />
    }
    return (
        <div className={styles.dataToolbar}>
            <button title='удалить договор' className={'antibutton' + ' ' + styles.dataToolbar__deleteIcon} onClick={onClickDeleteButton} ><DeleteForeverIcon fontSize='inherit' /></button>
            {showDeleteWarning && <Warning text={"Вы уверены, что хотите удалить договор?"} onSubmit={onSubmitDeleteContract} setShow={setShowDeleteWarning} />}
        </div>
    );
};

export default Toolbar;