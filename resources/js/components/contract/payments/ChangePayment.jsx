import React, {useEffect, useMemo, useRef, useState} from 'react';
import Payment from "./Payment";
import ButtonInForm from "../../dummyComponents/ButtonInForm";
import CustomModal from "../../dummyComponents/CustomModal";
import {useError} from "../../../hooks/useError";
import {ChangePaymentDispatcher} from "../../../store/Dispatchers/Contracts/ChangePaymentDispatcher";
import Warning from "../../dummyComponents/Warning";
import {useShow} from "../../../hooks/useShow";
import {DeletePaymentDispatcher} from "../../../store/Dispatchers/Contracts/DeletePaymentDispatcher";
import DeleteButton from "../../dummyComponents/DeleteButton";
import api from "../../../http";
import {getContractPath} from "../../../utils/getContractPath";
import Loading from "../../dummyComponents/Loading";

const ChangePayment = ({setShow, paymentId, update}) => {
    const [payment, setPayment] = useState({});
    const [enforcementProceeding, setEnforcementProceeding] = useState(payment.enforcementProceeding);
    const [compLoading, setCompLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const error = useError();
    const form = useRef();
    const onSubmit = (ev) => {
        ev.preventDefault();
        const dispatcher = new ChangePaymentDispatcher(error.setError, setLoading, form, setShow);
        dispatcher.addNoReqData('id', paymentId);
        dispatcher.addNoReqData('update', update);
        if(enforcementProceeding) {
            dispatcher.addData('enforcementProceedingId', enforcementProceeding.id);
        }
        dispatcher.handle();
    }
    const deletePaymentHandler = () => {
        const dispatcher = new DeletePaymentDispatcher(error.setError, setLoading, null, setShow);
        dispatcher.addNoReqData('id', paymentId);
        dispatcher.addNoReqData('update', update);
        dispatcher.handle();
    }
    const showDeleteWarning = useShow(Warning, {
        onSubmit: deletePaymentHandler,
        text: 'Вы уверены, что хотите удалить платеж? Отменить это действие невозможно'
    });

    useEffect(()=> {
        api.get(getContractPath('payments/get-one/' + paymentId))
            .then(({data}) => {
                if (data) {
                    console.log(data);
                    setPayment(data);
                    if (data.enforcementProceeding) setEnforcementProceeding(data.enforcementProceeding);
                }
            })
            .catch((e) => error.setError(e.message))
            .finally(() => setCompLoading(false));
    }, [])

    return (
        <CustomModal customStyles={{width: '300px'}} setShow={setShow}>
            {compLoading ? <Loading/> :
                <>
                <div className="margin-bottom_10">
                    <DeleteButton onClick={showDeleteWarning.setTrue} text={'Удалить'}/>
                </div>
                <form onSubmit={onSubmit} ref={form}>
                <Payment enforcementProceeding={enforcementProceeding} setEnforcementProceeding={setEnforcementProceeding} defaultValue={payment}/>
                <ButtonInForm loading={loading}/>
            {error.Comp()}
                </form>
            {showDeleteWarning.Comp()}
                </>
            }
        </CustomModal>
    );
};

export default ChangePayment;