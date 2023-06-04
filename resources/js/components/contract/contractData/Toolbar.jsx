import React, { useState } from 'react';
import styles from '../../../css/contract.module.css';
import selectDocument from '../../../img/documents-folder.png'
import Documents from '../documents/Documents';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Warning from '../../dummyComponents/Warning';
import { Navigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { deleteContract } from '../../../store/contracts/actions';





const Toolbar = () => {
    const {contractId} = useParams();
    const dispatch = useDispatch();
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [navigate, setNavigate] = useState(false);
    const onClickDeleteButton = () => {
        setShowDeleteWarning(true)
    }
    const onSubmitDeleteContract = async () => {
        await dispatch(deleteContract(contractId));
        setNavigate(true);
    }
    if(navigate) {
        return <Navigate to='/list' replace />
    }
    return (
        <div className={styles.dataToolbar}>
            <button title='удалить договор' className={'antibutton' + ' ' + styles.dataToolbar__deleteIcon} onClick={onClickDeleteButton} ><DeleteForeverIcon fontSize='inherit' /></button>
            {showDeleteWarning && <Warning text={"Вы уверены, что хотите удалить договор?"} onSubmit={onSubmitDeleteContract} setShow={setShowDeleteWarning} />}
        </div>
    );
};

export default Toolbar;