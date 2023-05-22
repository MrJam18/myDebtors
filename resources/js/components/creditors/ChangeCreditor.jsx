import { Button } from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import CustomModal from '../dummyComponents/CustomModal';
import { makeStyles } from '@mui/styles';
import ButtonInForm from '../dummyComponents/ButtonInForm';
import { useDispatch } from 'react-redux';
import {deleteOrganization} from '../../store/creditors/actions';
import Creditor from "./Creditor";
import {useError} from "../../hooks/useError";
import styles from '../../css/orgs.module.css';
import DefaultCessionChanger from "./DefaultCessionChanger";
import Loading from "../dummyComponents/Loading";
import api from "../../http/index";
import {Alert} from "../../classes/Alert";
import {ChangeCreditorDispatcher} from "../../store/Dispatchers/Creditor/ChangeCreditorDispatcher";
import Warning from "../dummyComponents/Warning";
import {DeleteCreditorDispatcher} from "../../store/Dispatchers/Creditor/DeleteCreditorDispatcher";

const useStyles = makeStyles({
    button: {
        width: '25%',
        height: '31px'
    },
    cessionButton: {
        width: '45%',
        height: '31px'
    }
})



const ChangeCreditor = ({creditorId, setShow, setUpdate}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [address, setAddress] = useState('initial');
    const error = useError(false);
    const [creditor, setCreditor] = useState({});
    const [loading, setLoading] = useState(true);
    const [isOrg, setIsOrg] = useState(creditor?.typeId !== 3);
    const [fixedStyles, setFixedStyles] = useState();
    const [bankRequisites, setBankRequisites] = useState();
    const [showDefaultCessionChanger, setShowDefaultCessionChanger]= useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const form = useRef();

    const formHandler = async (ev) => {
        ev.preventDefault();
        const dispatcher = new ChangeCreditorDispatcher(error.setError, setButtonLoading, form, setShow);
        dispatcher.addData('bankRequisitesId', bankRequisites.id);
        dispatcher.addData('address', address);
        dispatcher.addData('id', creditorId);
        await dispatcher.handle();
        setUpdate();
        // const controller = new ChangeCreditorController(error.setError, setloading, setShow, data, form);
        // await controller.handle();
    }

    const deleteHandler = async () => {
        const dispatcher = new DeleteCreditorDispatcher(error.setError, setLoading, null, setShow);
        dispatcher.addData('id', creditorId);
        dispatcher.addData('setUpdate', setUpdate);
        await dispatcher.handle();
    }
    const onClose = () => {
        error.noError();
    }
    const onStart = () => {
        if(!creditor || creditorId !== creditor.id)
        {
            setLoading(true);
            api.get('creditors/get-one?id=' + creditorId)
                .then((response) => {
                    if (response.data) {
                        setCreditor(response.data);
                        setBankRequisites(response.data.requisites.bankRequisites);
                    }

                })
                .catch((reason) => {
                    Alert.setError('Не могу получить кредитора', reason);
                })
                .finally(() => setLoading(false));
        }
    }
    useEffect(onStart, []);
    useEffect(()=> {
        if(creditor && creditor.id) {
            setBankRequisites(creditor.requisite.bankRequisite);
            setIsOrg(creditor.typeId !== 3)
        }
    }, [creditor]);

    return (
        <div>
            <form onSubmit={formHandler} ref={form}>
            <CustomModal onClose={onClose} show={true} setShow={setShow} fixedStyles={fixedStyles} customStyles={{minWidth: '500px', minHeight: '543px'}}>
                <div className="header_small">Изменение кредитора</div>
                {loading && <Loading size='90' bold='9' addStyles={{padding: '120px'}} />}
                {!loading && <>
                    <div className={styles.buttons}>
                    <Button color='error' onClick={()=> setShowDeleteWarning(true)} className={classes.button} variant='contained' > Удалить </Button>
                    <Button color='success' onClick={()=>setShowDefaultCessionChanger(true)} className={classes.cessionButton} variant='contained' >Цессия по умолчанию</Button>
                    </div>
                    <Creditor setAddress={setAddress} defaultRequisites={creditor?.requisites} setBankRequisites={setBankRequisites} setFixedStyles={setFixedStyles} defaultValues={creditor} setIsOrg={setIsOrg} isOrg={isOrg} bankRequisites={bankRequisites} />
                    <div className="margin-bottom_10">
                        <ButtonInForm loading={buttonLoading} />
                    </div>
                    {error.Comp()}
                </>}
                {showDefaultCessionChanger && <DefaultCessionChanger cession={creditor.cession} creditorId={creditor.id} setShow={setShowDefaultCessionChanger} />}
                {showDeleteWarning && <Warning setShow={setShowDeleteWarning} onSubmit={deleteHandler} text={'Вы уверены что хотите удалить кредитора? Это действие необратимо'} />}
            </CustomModal>

            </form>

        </div>
    );
};

export default ChangeCreditor;