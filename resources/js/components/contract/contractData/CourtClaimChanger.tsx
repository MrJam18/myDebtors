import {faFile} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useRef, useState} from "react";
import {Alert} from "../../../classes/Alert";
import {useDispatcher} from "../../../hooks/useDispatcher";
import {useError} from "../../../hooks/useError";
import {useShow} from "../../../hooks/useShow";
import api, {saveFile} from "../../../http/index";
import {createUpdateElementsFunc} from "../../../utils/createUpdateElementFunc";
import {formDataConverter} from "../../../utils/formDataConverter";
import {getContractPath} from "../../../utils/getContractPath";
import {changeChecked} from "../../../utils/inputs/changeChecked";
import CustomFormStepper from "../../dummyComponents/CustomFormStepper";
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

const defaultData: Record<string, any> = {
    status_date: 'Неизвестно'
}

const CourtClaimChanger = ({setShow, update}) => {

    const [claimsArray, setClaimsArray] = useState([]);
    const [activeClaim, setActiveClaim] = useState(defaultData);
    const [deleteIds, setDeleteIds] = useState([]);
    const [court, setCourt] = useState(null);
    const [agent, setAgent] = useState(null);
    const [typeId, setTypeId] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const formRef = useRef<HTMLFormElement>();
    const error = useError();
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const dispatcher = useDispatcher(error.setError, {alertText: 'Судебный иск успешно сохранен', setShow, update, setLoading: setButtonLoading});
    const showAddCourt = useShow(CourtCreator, {setValue: setCourt});
    const updateInputs = (data: Record<string, any>)=> {
        if(formRef.current && data) {
            const elements = formRef.current.elements as Record<any, any>;
            const updateElements = createUpdateElementsFunc(data, elements as HTMLFormControlsCollection);
            changeChecked(elements.is_contract_jurisdiction, data.is_contract_jurisdiction);
            changeChecked(elements.is_ignored_payments, data.is_ignored_payments);
            updateElements('count_date');
            updateElements('main');
            updateElements('percents');
            updateElements('penalties');
            updateElements('fee');
            setTypeId(data.type_id ?? 0);
            setStatusId(data.status_id ?? 0);
            setAgent(data.agent);
            setCourt(data.court);
        }
    }

    const onDeleteAll = async ()=> {
        try {
            setLoading(true)
            await api.delete(getContractPath('court-claims/delete-all-by-contract'));
            update();
            setShow(false);
            Alert.set('Успешно', "Все судебные иски удалены");
        }
        catch (e) {
            error.setError(e.message);
        }
        finally {
            setLoading(false);
        }
    }
    const onSubmit = (dataArray)=> {
        dispatcher.addData('courtClaims', dataArray);
        dispatcher.addData('deleteIds', deleteIds);
        dispatcher.handle(getContractPath('court-claims/update-list-by-contract'), 'post');
        // dispatcher.handle(getContractPath('court-claims/change-or-create-one'), 'post');
    }
    const getUpdatedData = (data: Record<string, string>): Record<string, any> => {
        data.court = court;
        data.agent = agent;
        data.status_date = activeClaim.status_date;
        if (activeClaim.id) data.id = activeClaim.id;
        return data;
    }


    const onDownloadDocument = () => {
        saveFile('documents/get-court-claim-doc/' + activeClaim.id)
            .catch((e) => Alert.setError('Ошибка при загрузке файла', e));
    }
    useEffect(() => {
        api.get(getContractPath('court-claims/get-list-by-contract'))
            .then(({data}) => {
                if (Array.isArray(data) && data.length !== 0) {
                    setClaimsArray(data);
                }
            })
            .catch((e) => error.setError(e.message))
            .finally(() => setLoading(false));
        api.get('agents/get-default')
            .then(({data}) => {
                if (data) defaultData.agent = data;
            })
            .catch((e) => Alert.setError('Ошибка при получении агента по умолчанию', e));
    }, []);

    return (
        <CustomModal setShow={setShow} header={'Изменение судебного иска'} customStyles={{width: 500}}>
            {showAddCourt.Comp()}
            {loading ? <Loading/> : <>
                <CustomFormStepper
                    dataArray={claimsArray}
                    setDataArray={setClaimsArray}
                    setActiveData={setActiveClaim}
                    setDeleteIds={setDeleteIds}
                    getUpdatedData={getUpdatedData}
                    onSubmit={onSubmit}
                    loading={buttonLoading}
                    onChangeStep={updateInputs}
                    defaultData={defaultData}
                    onDeleteAll={onDeleteAll}
                    ref={formRef} >
                    <div className={styles.fullWidthBlock + ' margin-top_10'}>
                        <ServerSelect setId={setTypeId} id={typeId} required label={"Тип судебного иска"} name={'type_id'} serverAddress={'court-claims/get-types'}/>
                    </div>

                    <div className={styles.flexBetween + ' margin_0'}>
                        <div className={styles.smallBlock}>
                            <CustomInput type={'date'} className={styles.fullWidthBlock} label={'Дата расчета иска'}
                                         name={'count_date'}/>
                            <ServerSelect setId={setStatusId} id={statusId} required customClassName={styles.fullWidthBlock} name={'status_id'} label={'Cтатус'} serverAddress={'court-claims/get-statuses'}/>
                            <div className={styles.fullWidthBlock}>
                                Статус обновлен: {activeClaim.status_date}
                            </div>
                        </div>
                        <div className={styles.smallBlock}>
                            <EasyCheckBox label={'Игнорировать платежи при ограничении процентов'}
                                          name={'is_ignored_payments'}/>
                            <EasyCheckBox label={'Договорная подсудность'} name={'is_contract_jurisdiction'}/>
                            {activeClaim.id &&
                            <div className={"flex"} onClick={onDownloadDocument} style={{alignItems: 'center', cursor: 'pointer'}}>
                                {/*@ts-ignore*/}
                                <FontAwesomeIcon icon={faFile} style={{width: '20px', height: '25px'}} />
                                <div className={'text'} style={{marginLeft: '10px'}}>Скачать файл</div>
                            </div> }
                        </div>
                    </div>
                    <SearchAndAddButton required onClickAddButton={showAddCourt.setTrue} value={court} label={'Суд'} serverAddress={'courts/search-list'} setValue={setCourt} className={styles.fullWidthBlock}/>
                    <EasySearch required label={'Представитель по делу'} serverAddress={'agents/search-list'}
                                setValue={setAgent} value={agent}/>
                    <h3 className={'header_small margin-top_10'}>Истребуемые суммы</h3>
                    <div className={styles.flexBetween}>
                        <EasyInput required className={styles.smallInput} name={'main'} pattern={'float'} label={'осн. долг'}/>
                        <EasyInput required className={styles.smallInput} name={'percents'} pattern={'float'}
                                   label={'проценты'}/>
                    </div>
                    <div className={styles.flexBetween}>
                        <EasyInput required className={styles.smallInput} name={'penalties'} pattern={'float'}
                                   label={'неустойка'}/>
                        <EasyInput required className={styles.smallInput} name={'fee'} pattern={'float'} label={'госпошлина'}/>
                    </div>
                </CustomFormStepper>
            {error.Comp()}
            </>
            }
        </CustomModal>
    );
};

export default CourtClaimChanger