import React, {useRef, useState} from 'react';
import CustomModal from "../dummyComponents/CustomModal";
import CustomInput from "../dummyComponents/CustomInput";
import styles from "../../css/orgs.module.css";
import {useError} from "../../hooks/useError";
import ButtonInForm from "../dummyComponents/ButtonInForm";
import {AddBankRequisitesDispatcher} from "../../store/Dispatchers/Creditor/AddBankRequisitesDispatcher";
// import {AddBanksRequisitesController} from "../../controllers/AddBanksRequisitesController";

const AddBanksRequisites = ({setShow}) => {
    const formRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const {Comp, setError} = useError();
    const onSubmit = async ()=> {
        if(formRef.current.reportValidity()) {
            const dispatcher = new AddBankRequisitesDispatcher(setError, setLoading, formRef, setShow);
            await dispatcher.handle();
        }
    }
    return (
  <CustomModal customClassName={styles.addBankModal} fixedStyles={{bottom: '50%'}} setShow={setShow} >
      <div className="block-header">Укажите реквизиты банка</div>
      <form ref={formRef}>
      <div className="inputs-box">
        <CustomInput label='имя банка' name='name' noSubmit required />
      </div>
      <div className="inputs-box">
        <CustomInput customValidity={'БИК должен состоять из 9 цифр'} pattern={'^\\d{9}$'} label="БИК" noSubmit name='BIK' required />
      </div>
      <ButtonInForm  onClick={onSubmit} type='button' loading={loading}   />
      </form>
      <Comp />
  </CustomModal>
 );
};

export default AddBanksRequisites;