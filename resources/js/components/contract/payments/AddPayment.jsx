import React, {useRef, useState} from 'react';
import CustomModal from "../../dummyComponents/CustomModal";
import Payment from "./Payment";
import ButtonInForm from "../../dummyComponents/ButtonInForm";
import {useError} from "../../../hooks/useError";
import {useDispatcher} from "../../../hooks/useDispatcher";
import {getContractPath} from "../../../utils/getContractPath";

const AddPayment = ({ setModal, update })=> {
 const [enforcementProceeding, setEnforcementProceeding] = useState(null);
 const form = useRef();
 const error = useError();
 const [loading, setLoading] = useState(false);
 const dispatcher = useDispatcher(error.setError, {setShow: setModal, update, setLoading, alertText: "платеж успешно добавлен", formRef: form});
 const formHandler = (ev) => {
  ev.preventDefault();
  if(enforcementProceeding) dispatcher.addData('enforcementProceedingId', enforcementProceeding.id);
  dispatcher.handle(getContractPath('payments/add-one'), 'post');
 }
 return <CustomModal customStyles={{width: '300px'}} setShow={setModal} >
     <form onSubmit={formHandler} ref={form}>
     <Payment enforcementProceeding={enforcementProceeding} setEnforcementProceeding={setEnforcementProceeding} />
      <ButtonInForm loading={loading} />
      {error.Comp()}
     </form>
   </CustomModal>
}

export default AddPayment;