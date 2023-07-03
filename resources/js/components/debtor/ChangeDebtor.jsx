import { useEffect, useState } from "react";
import { Alert } from "../../classes/Alert";
import { useForm } from "../../hooks/useForm";
import api from "../../http/index";
import CustomModal from "../dummyComponents/CustomModal";
import Loading from "../dummyComponents/Loading";
import Debtor from "./Debtor";
const ChangeDebtor = ({ debtorId, setShow, update }) => {
    const form = useForm({ buttonText: "Сохранить", setShow, update, alertText: "Должник успешно изменен" });
    const [addressForDB, setAddressForDB] = useState(null);
    const [debtor, setDebtor] = useState({});
    const [loading, setLoading] = useState(true);
    const onSubmit = (ev) => {
        ev.preventDefault();
        const dispatcher = form.dispatcher;
        dispatcher.addData('address', addressForDB);
        dispatcher.handle('debtors/change-one/' + debtorId, 'post');
    };
    useEffect(function () {
        api.get('debtors/get-one/' + debtorId)
            .then(({ data }) => {
            setDebtor(data);
        })
            .catch((e) => {
            Alert.setError('Ошибка при получении кредитора', e);
        })
            .finally(() => setLoading(false));
    }, []);
    return (<CustomModal header={'Изменение должника'} customStyles={{ width: '40%', minWidth: '465px', maxWidth: '500px' }} setShow={setShow}>
            {loading ? <Loading /> :
            <form onSubmit={onSubmit} ref={form.ref}>
                    <Debtor formRef={form.ref} setAddressForDB={setAddressForDB} defaultValues={debtor}/>
                    {form.Button()}
                </form>}
        </CustomModal>);
};
export default ChangeDebtor;
