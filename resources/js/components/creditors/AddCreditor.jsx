import React, { useRef, useState } from 'react';
import CustomModal from '../dummyComponents/CustomModal';
import ButtonInForm from '../dummyComponents/ButtonInForm';
import Creditor from "./Creditor";
import {useError} from "../../hooks/useError";
import {AddCreditorDispatcher} from "../../store/Dispatchers/Creditor/AddCreditorDispatcher";



const AddCreditor = ({setShow, setUpdate, setCreditor = null}) => {
    const [address, setAddress] = useState(false);
    const error = useError();
    const [loading, setLoading] = useState(false);
    const form = useRef();
    const [isOrg, setIsOrg] = useState(true);
    const [fixedStyles, setFixedStyles] = useState();
    const [bankRequisites, setBankRequisites] = useState();
    const formHandler = (ev) => {
        ev.preventDefault();
        const dispatcher = new AddCreditorDispatcher(error.setError, setLoading, form, setShow);
        dispatcher.addData('address', address);
        dispatcher.addData('bankRequisitesId', bankRequisites.id);
        dispatcher.addNoReqData('setUpdate', setUpdate);
        dispatcher.addNoReqData('setCreditor', setCreditor);
        dispatcher.handle();

    }

    return (
        <div>
            <form onSubmit={formHandler} ref={form}>
            <CustomModal fixedStyles={fixedStyles} setShow={setShow}  customStyles={{width: '500px'}}>
                <div className="header_small">Укажите данные кредитора</div>
                <Creditor bankRequisites={bankRequisites} setBankRequisites={setBankRequisites} isOrg={isOrg} setIsOrg={setIsOrg} setAddress={setAddress} setFixedStyles={setFixedStyles} />
                <div className="margin-bottom_10">
                    <ButtonInForm loading={loading} />
                </div>
                {error.Comp()}
            </CustomModal>
            </form>
            
        </div>
    );
};

export default AddCreditor;