import React, {FormEvent, useEffect, useState} from "react";
import {Alert} from "../../classes/Alert";
import styles from "../../css/addDebtor.module.css";
import {useForm} from "../../hooks/useForm";
import {useShow} from "../../hooks/useShow";
import api from "../../http/index";
import {EasyDispatcher} from "../../store/Dispatchers/EasyDispatcher";
import CustomModal from "../dummyComponents/CustomModal";
import DeleteButton from "../dummyComponents/DeleteButton";
import Loading from "../dummyComponents/Loading";
import Warning from "../dummyComponents/Warning";
import Debtor from "./Debtor";

const ChangeDebtor = ({debtorId, setShow, update, withModal = true}) => {
    const form = useForm({buttonText: "Сохранить", setShow, update, alertText: "Должник успешно изменен"});
    const [addressForDB, setAddressForDB] = useState(null);
    const [debtor, setDebtor] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const onDeleteDebtor = () => {
        const dispatcher = new EasyDispatcher(form.setError, {
            setLoading, setShow, update, alertText: 'Должник успешно удален'
        });
        dispatcher.handle('debtors/delete-one/' + debtorId, 'delete');
    }
    const showDeleteWarning = useShow(Warning, {
        text: 'Вы уверены что хотите удалить должника? Также удалятся все связанные с ним договора. Отменить это действие будет невозможно',
        onSubmit: onDeleteDebtor
    });
    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        const dispatcher = form.dispatcher;
        dispatcher.addData('address', addressForDB);
        dispatcher.handle('debtors/change-one/' + debtorId, 'post');
    }
    useEffect(function () {
        api.get('debtors/get-one/' + debtorId)
            .then(({data}) => {
                setDebtor(data);
            })
            .catch((e) => {
                Alert.setError('Ошибка при получении кредитора', e);
            })
            .finally(() => setLoading(false));
    }, []);

    const Inner = () => (loading ? <Loading/> :
                <>
                    {showDeleteWarning.Comp()}
                    {withModal && <>
                        <div className='header_small'>Изменение должника</div>
                        <div className="toolbar margin-bottom_10">
                            <DeleteButton onClick={showDeleteWarning.setTrue} />
                        </div>
                    </>}
                    <form onSubmit={onSubmit} ref={form.ref}>
                        <Debtor formRef={form.ref} setAddressForDB={setAddressForDB} defaultValues={debtor}/>
                        {form.Button()}
                    </form>
                </>);

    return (
        <>
            {withModal ?
                <CustomModal customStyles={{ width: '40%', minWidth: '465px', maxWidth: '500px' }} setShow={setShow}>
                    <Inner />
                </CustomModal>
                : <Inner />}
        </>
    );
}

export default ChangeDebtor