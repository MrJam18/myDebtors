import {FormEvent, useState} from "react";
import {useSelector} from "react-redux";
import styles from "../../../css/contract.module.css";
import {useError} from "../../../hooks/useError";
import {useLoading} from "../../../hooks/useLoading";
import {contractsSelectors} from "../../../store/contracts/selectors";
import {ChangeCreditorDispatcher} from "../../../store/Dispatchers/Contracts/ChangeCreditorDispatcher";
import ButtonInForm from "../../dummyComponents/ButtonInForm";
import CustomModal from "../../dummyComponents/CustomModal";
import EasySearch from "../../dummyComponents/search/EasySearch";

type Props = {
    setShow: (boolean) => void,
    update: () => void
}
const defaultCession = { name: 'Принадлежит выдавшей организации', id: null };
const CreditorChanger = ({setShow, update}: Props) => {
    const contract = useSelector(contractsSelectors.getCurrent) as Record<any, any>;
    const [creditor, setCreditor] = useState({
        name: contract.creditor,
        id: contract.creditorId
    });
    const [cession, setCession] = useState({
        name: contract.cession,
        id: contract.cessionId
    });
    const error = useError();
    const loading = useLoading(false);
    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        const dispatcher = new ChangeCreditorDispatcher(error.setError, loading.set, null, setShow, update);
        dispatcher.addData('creditorId', creditor.id);
        dispatcher.addData('cessionId', creditor.id);
        dispatcher.handle();
    }
    const onChangeCreditor = (creditor) => {
        setCreditor(creditor);
        if (creditor?.default_cession) {
            setCession(creditor.default_cession);
        }
        else
            setCession(defaultCession);
    }
    return (
        <CustomModal setShow={setShow} header={"Изменение кредитора"}>
            <div className={'header_small'}>
                Изменение кредитора
            </div>
            <form onSubmit={onSubmit}>
                <div className={styles.fullWidthBlock}>
                    <EasySearch label='кредитор, которому принадлежит заем' value={creditor} required serverAddress={'creditors/search-list-with-cession'} setValue={onChangeCreditor} />
                </div>
                <div className={styles.fullWidthBlock}>
                    <EasySearch reqData={creditor ? {creditorId: creditor.id} : null} label='договор цессии, по которому приобретен займ' value={cession} required serverAddress={'cessions/search-list'} setValue={setCession}/>
                </div>
                <ButtonInForm loading={loading.state} text={'Сохранить'} />
                {error.Comp()}
            </form>
        </CustomModal>
        );
}

export default CreditorChanger