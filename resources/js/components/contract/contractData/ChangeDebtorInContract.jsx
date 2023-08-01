import { useRef, useState } from "react";
import { useError } from "../../../hooks/useError";
import { EasyDispatcher } from "../../../store/Dispatchers/EasyDispatcher";
import { getContractPath } from "../../../utils/getContractPath";
import ChangeDebtor from "../../debtor/ChangeDebtor";
import ButtonInForm from "../../dummyComponents/ButtonInForm";
import CustomModal from "../../dummyComponents/CustomModal";
import EasySelect from "../../dummyComponents/EasySelect";
import EasySearch from "../../dummyComponents/search/EasySearch";
const variants = [
    { id: 1, name: 'Изменить текущего должника' },
    { id: 2, name: 'Выбрать другого должника' }
];
const ChangeDebtorInContract = ({ setShow, debtorId, update }) => {
    const [changeDebtorVariant, setChangeDebtorVariant] = useState(null);
    const [currentDebtor, setCurrentDebtor] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const formRef = useRef();
    const error = useError();
    const onSubmit = (ev) => {
        ev.preventDefault();
        const dispatcher = new EasyDispatcher(error.setError, {
            setLoading: setButtonLoading,
            setShow,
            update,
            alertText: 'Должник успешно изменен'
        });
        dispatcher.handle(getContractPath('change-debtor/' + currentDebtor.id), 'get');
    };
    return (<CustomModal customStyles={{ width: '40%', minWidth: '465px', maxWidth: '500px' }} setShow={setShow}>
        <EasySelect customClassName='margin-bottom_10' variants={variants} label={'Тип изменения должника'} onChange={setChangeDebtorVariant} name={'changeDebtorVariant'}/>
            {changeDebtorVariant === 1 &&
            <ChangeDebtor setShow={setShow} debtorId={debtorId} update={update} withModal={false}/>}
            {changeDebtorVariant === 2 &&
            <form onSubmit={onSubmit} ref={formRef}>
                    <EasySearch required serverAddress={'debtors/search-list'} setValue={setCurrentDebtor} label={'Должник по договору'} value={currentDebtor}/>
                    <ButtonInForm text={'Сохранить'} loading={buttonLoading}/>
                    {error.Comp()}
                </form>}
        </CustomModal>);
};
export default ChangeDebtorInContract;
