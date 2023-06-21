import React, {useMemo, useRef, useState} from 'react';
import Payment from "./Payment";
import ButtonInForm from "../../dummyComponents/ButtonInForm";
import CustomModal from "../../dummyComponents/CustomModal";
import {useError} from "../../../hooks/useError";
import {changeDateFormatOnISO} from "../../../utils/changeDateFormat";
import {ChangePaymentDispatcher} from "../../../store/Dispatchers/Contracts/ChangePaymentDispatcher";
import Warning from "../../dummyComponents/Warning";
import {useShow} from "../../../hooks/useShow";
import {DeletePaymentDispatcher} from "../../../store/Dispatchers/Contracts/DeletePaymentDispatcher";
import DeleteButton from "../../dummyComponents/DeleteButton";

const ChangePayment = ({setShow, payment, update}) => {
    const changedPayment = useMemo(()=> {
        let returned = {...payment};
        returned.date = changeDateFormatOnISO(payment.date);
        return returned;
    },[payment]);
    const [loading, setLoading] = useState(false);
    const error = useError();
    const form = useRef();
    const onSubmit = (ev) => {
        ev.preventDefault();
        const dispatcher = new ChangePaymentDispatcher(error.setError, setLoading, form, setShow);
        dispatcher.addNoReqData('id', payment.idd);
        dispatcher.addNoReqData('update', update);
        dispatcher.handle();
    }
    const deletePaymentHandler = () => {
        const dispatcher = new DeletePaymentDispatcher(error.setError, setLoading, null, setShow);
        dispatcher.addNoReqData('id', payment.idd);
        dispatcher.addNoReqData('update', update);
        dispatcher.handle();
    }
    const showDeleteWarning = useShow(Warning, {
        onSubmit: deletePaymentHandler,
        text: 'Вы уверены, что хотите удалить платеж? Отменить это действие невозможно'
    });

    return (
        <CustomModal customStyles={{width: '300px'}} setShow={setShow}>
            <div className="margin-bottom_10">
                <DeleteButton onClick={showDeleteWarning.setTrue} text={'Удалить'} />
            </div>
            <form onSubmit={onSubmit} ref={form}>
                <Payment defaultValue={changedPayment}/>
                <ButtonInForm loading={loading}/>
                {error.Comp()}
            </form>
            {showDeleteWarning.Comp()}
        </CustomModal>
    );
};

export default ChangePayment;