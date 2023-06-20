import {useEffect, useState} from "react";
import {Alert} from "../../../classes/Alert";
import {useForm} from "../../../hooks/useForm";
import {useShow} from "../../../hooks/useShow";
import api from "../../../http/index";
import {getContractPath} from "../../../utils/getContractPath";
import CustomInput from "../../dummyComponents/CustomInput";
import CustomModal from "../../dummyComponents/CustomModal";
import EasyCheckBox from "../../dummyComponents/EasyCheckBox";
import EasyInput from "../../dummyComponents/EasyInput";
import Loading from "../../dummyComponents/Loading";
import EasySearch from "../../dummyComponents/search/EasySearch";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";
import ServerSelect from "../../dummyComponents/ServerSelect";
import styles from '../../../css/contract.module.css';
import CourtCreator from "./CourtCreator";

const CourtClaimChanger = ({setShow, courtClaimId = null, update}) => {
    const [court, setCourt] = useState(null);
    const [agent, setAgent] = useState(null);
    const form = useForm({buttonText: 'Сохранить', setShow, update, alertText: 'Судебный иск успешно сохранен'});
    const [loading, setLoading] = useState(false);
    const [courtClaim, setCourtClaim] = useState<Record<string, any>>({
        status_date: 'Неизвестно'
    });
    const showAddCourt = useShow(CourtCreator, {setValue: setCourt});
    useEffect(() => {
        if(courtClaimId) {
            setLoading(true);
            api.get(getContractPath('court-claims/get-one/' + courtClaimId))
                .then(({data}) => {
                    if (data) {
                        setCourtClaim(data);
                        setCourt(data.court);
                        setAgent(data.agent);
                    }
                })
                .catch((e) => form.setError(e.message))
                .finally(() => setLoading(false));
        }
        else {
            api.get('agents/get-default')
                .then(({data}) => {
                    if (data) setAgent(data);
                })
                .catch((e) => Alert.setError('Ошибка при получении агента по умолчанию', e));
        }
    }, []);
    const onSubmit = (ev)=> {
        ev.preventDefault();
        const dispatcher = form.dispatcher;
        dispatcher.addData('court_id', court.id);
        dispatcher.addData('agent_id', agent.id);
        if(courtClaimId) dispatcher.addData('courtClaimId', courtClaimId);
        dispatcher.handle(getContractPath('court-claims/change-or-create-one'), 'post');
    }

    return (
        <CustomModal setShow={setShow} header={'Изменение судебного иска'} customStyles={{width: 500}}>
            {showAddCourt.Comp()}
            {loading ? <Loading/> :
                <form onSubmit={onSubmit} ref={form.ref}>
                    <div className={styles.fullWidthBlock}>
                        <ServerSelect defaultId={courtClaim.typeId} required label={"Тип судебного иска"} name={'type_id'} serverAddress={'court-claims/get-types'}/>
                    </div>

                    <div className={styles.flexBetween + ' margin_0'}>
                        <div className={styles.smallBlock}>
                            <CustomInput type={'date'} defaultValue={courtClaim.count_date} className={styles.fullWidthBlock} label={'Дата расчета иска'}
                                         name={'count_date'}/>
                            <ServerSelect required defaultId={courtClaim.statusId} customClassName={styles.fullWidthBlock} name={'status_id'} label={'Cтатус'}
                                          serverAddress={'court-claims/get-statuses'}/>
                            <div className={styles.fullWidthBlock}>
                                Статус обновлен: {courtClaim.status_date}
                            </div>
                        </div>
                        <div className={styles.smallBlock}>
                            <EasyCheckBox defaultValue={courtClaim.is_ignored_payments} label={'Игнорировать платежи при ограничении процентов'}
                                          name={'is_ignored_payments'}/>
                            <EasyCheckBox defaultValue={courtClaim.is_contract_jurisdiction} label={'Договорная подсудность'} name={'is_contract_jurisdiction'}/>
                        </div>
                    </div>
                    <SearchAndAddButton required onClickAddButton={showAddCourt.setTrue} value={court} label={'Суд'} serverAddress={'courts/search-list'} setValue={setCourt} className={styles.fullWidthBlock}/>
                    <EasySearch required label={'Представитель по делу'} serverAddress={'agents/search-list'}
                                setValue={setAgent} value={agent}/>
                    <h3 className={'header_small margin-top_10'}>Истребуемые суммы</h3>
                    <div className={styles.flexBetween}>
                        <EasyInput defaultValue={courtClaim.main} required className={styles.smallInput} name={'main'} pattern={'float'} label={'осн. долг'}/>
                        <EasyInput defaultValue={courtClaim.percents} required className={styles.smallInput} name={'percents'} pattern={'float'}
                                   label={'проценты'}/>
                    </div>
                    <div className={styles.flexBetween}>
                        <EasyInput required defaultValue={courtClaim.penalties} className={styles.smallInput} name={'penalties'} pattern={'float'}
                                   label={'неустойка'}/>
                        <EasyInput defaultValue={courtClaim.fee} required className={styles.smallInput} name={'fee'} pattern={'float'} label={'госпошлина'}/>
                    </div>
                    {form.Button()}
                </form>
            }
        </CustomModal>
    );
};

export default CourtClaimChanger