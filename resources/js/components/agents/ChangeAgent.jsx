import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CustomModal from '../dummyComponents/CustomModal';
import { makeStyles } from '@mui/styles';
import ButtonInForm from '../dummyComponents/ButtonInForm';
import { setloading } from '../../store/global';
import Agent from "./Agent";
import {ChangeAgentDispatcher} from "../../store/Dispatchers/Agent/ChangeAgentDispatcher";
import api from "../../http/index";
import {Alert} from "../../classes/Alert";
import Warning from "../dummyComponents/Warning";
import {DeleteAgentDispatcher} from "../../store/Dispatchers/Agent/DeleteAgentDispatcher";

const useStyles = makeStyles({
    deleteButton: {
        width: '180px',
        marginBottom: '20px'
    }
})


const ChangeAgent = ({setShow, agentId, setUpdate}) => {
    const classes = useStyles();
    const [address, setAddress] = useState('initial');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [agent, setAgent] = useState({});
    const form = useRef();
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const formHandler = async (ev) => {
        ev.preventDefault();
        const dispatcher = new ChangeAgentDispatcher(setError, setButtonLoading, form, setShow);
        dispatcher.addData('id', agentId);
        dispatcher.addData('address', address);
        await dispatcher.handle();
        setUpdate(true);
    }
    const deleteHandler = async () => {
        const dispatcher = new DeleteAgentDispatcher(setError, setLoading, null, setShow);
        dispatcher.addData('id', agentId);
        dispatcher.addNoReqData('update', setUpdate);
        await dispatcher.handle();
        setShowDeleteWarning(false);
    }
    useEffect(()=>{
        setLoading(true);
        api.get('agents/get-one/' + agentId)
            .then((res) => {
                if (res.data) {
                    const data = res.data;
                    setAgent(data);
                }
            })
            .catch((reason) => Alert.setError('Ошибка при получении представителя', reason))
            .finally(() => setLoading(false));
        return ()=> {
            setError(false);
            setloading(true);
        }
    }, []);

    return (
        <div>
            <form onSubmit={formHandler} ref={form}>
            <CustomModal setShow={setShow} customStyles={{width: '500px'}}>
                {!loading &&
                    <>
                    <div className="header_small">Изменение представителя</div>
                    <Button color='error' onClick={()=>setShowDeleteWarning(true)} className={classes.deleteButton} variant='contained' > Удалить агента </Button>
                    <Agent setAddressForDB={setAddress} defaultValues={agent} />
                    <ButtonInForm loading={buttonLoading} />
                    <div className="error">{error}</div>

                </>}
                {showDeleteWarning && <Warning onSubmit={deleteHandler} setShow={setShowDeleteWarning} text={'Вы уверены, что хотите удалить представителя? Это действие необратимо.'} /> }
            </CustomModal>
            </form>

        </div>
    );
};

export default ChangeAgent;
