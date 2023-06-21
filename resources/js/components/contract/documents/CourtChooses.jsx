import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useRef, useState } from 'react';
import { setCourtsList } from '../../../store/courts/actions';
import getISODate from '../../../utils/getISODate';
import CourtCreator from '../contractData/CourtCreator';
import { useDispatch } from 'react-redux';
import styles from '../../../css/contract.module.css';
import EasySearch from "../../dummyComponents/search/EasySearch";
import api from "../../../http";
import EasyCheckBox from "../../dummyComponents/EasyCheckBox";
import {Alert} from "../../../classes/Alert";
import {CreateCourtClaimDispatcher} from "../../../store/Dispatchers/Contracts/CreateCourtClaimDispatcher";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";

const useStyles = makeStyles({
    input: {
        marginBottom: '10px'
    },
    icon: {
        width: '35px',
        height: '50px',
        fontSize: '5px'
    },
    button: {
        width: '50%'
    }
})

const CourtChooses = ({contractId, selectedDoc, setError, setLoading, update}) => {
    const dispatch = useDispatch();
    const [showCourtCreator, setShowCourtCreator] = useState(false);
    const [agent, setAgent] = useState();
    const [court, setCourt] = useState();
    const classes = useStyles();
    const formRef = useRef();
    const changeShowCourtCreator = () =>{
        setShowCourtCreator(true);
    }
    useEffect( ()=> {
        api.get('agents/get-default')
            .then((response) => {
                if(response.data) setAgent(response.data)
            })
            .catch((error) => Alert.setError('Ошибка при получении представителя по умолчанию', error));
        return ()=> {
            dispatch(setCourtsList([]));
        }
    }, []);
    const onSubmit = async (ev) => {
        ev.preventDefault();
        const dispatcher = new CreateCourtClaimDispatcher(setError, setLoading, formRef, null, update);
        dispatcher.addNoReqData('contractId', contractId);
        dispatcher.data = {
            ...dispatcher.data,
            courtId: court?.id,
            agentId: agent?.id,
            typeId: selectedDoc.id
        }
        dispatcher.handle();
    }
    return (
        <div>
            {showCourtCreator && <CourtCreator show={showCourtCreator} setShow={setShowCourtCreator} setValue={setCourt} />}
            <form id='submitSelectDocument' ref={formRef} onSubmit={onSubmit}>
            <TextField type='date' name='date' label='Дата расчета' defaultValue={getISODate()} variant='standard' InputLabelProps={{shrink: true}} required fullWidth size='small' className={classes.input} />
                <div className={styles.data__toolbar__courtBox}>
                    <SearchAndAddButton serverAddress={'courts/search-list'} setValue={setCourt} value={court} onClickAddButton={changeShowCourtCreator} required label={'Название суда'} />
                </div>
                <EasySearch label={'Представитель'} setValue={setAgent} value={agent} serverAddress={'agents/search-list'} required />
                <div className={styles.documents__checkboxesContainer}>
                    <EasyCheckBox label="Договорная подсудность" name={'is_contract_jurisdiction'} />
                    <EasyCheckBox label="Игнорировать платежи при ограничении процентов" name='is_ignored_payments' />
                    <EasyCheckBox label="Создать судебный иск" name='isCourtClaimCreated' />
                </div>
                </form>
        </div>
    );
};

export default CourtChooses;