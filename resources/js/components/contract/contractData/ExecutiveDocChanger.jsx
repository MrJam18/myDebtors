import React, {useEffect, useRef, useState} from 'react';
import CustomModal from '../../dummyComponents/CustomModal';
import EasySelect from '../../dummyComponents/EasySelect';
import styles from '../../../css/contract.module.css';
import ButtonInForm from '../../dummyComponents/ButtonInForm';
import { useParams } from 'react-router';
import CreateBailiff from "./CreateBailiffDepartment";
import CourtCreator from "./CourtCreator";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";
import EasyInput from "../../dummyComponents/EasyInput";
import CustomInput from "../../dummyComponents/CustomInput";
import useModal from "../../../hooks/useModal";
import api from "../../../http";
import Loading from "../../dummyComponents/Loading";
import {Alert} from "../../../classes/Alert";
import {SetExecutiveDocumentDispatcher} from "../../../store/Dispatchers/Contracts/SetExecutiveDocumentDispatcher";
import EnforcementProceedings from "./EnforcementProceedings";

const types = [{name: 'Судебный приказ', id: 1}, {name: 'Исполнительный лист', id: 2}]


const ExecutiveDocChanger = ({setShow, update}) => {
    const [docLoading, setDocLoading] = useState(true);
    const [executiveDoc, setExecutiveDoc] = useState({});
    const formRef = useRef();
    const {contractId} = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bailiff, setBailiff] = useState(null);
    const [showCreateBailiff, setShowCreateBailiff] = useState(false);
    const [typeId, setTypeId] = useState(null);
    const [court, setCourt] = useState(executiveDoc.court);
    const showCourtCreator = useModal();
    const showEnforcementProceedings = useModal();
    const [enforcementProceedings, setEnforcementProceedings] = useState([]);
    const onClickCreateBailiff = () => {
        setShowCreateBailiff(true);
    }

    let lastProceeding = enforcementProceedings.length > 0 ? enforcementProceedings[enforcementProceedings.length - 1] : null;

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const dispatcher = new SetExecutiveDocumentDispatcher(setError, setLoading, formRef, setShow);
        dispatcher.addData('court', court);
        dispatcher.addData('bailiff', bailiff);
        dispatcher.addData('typeId', typeId);
        dispatcher.addData('executiveDocId', executiveDoc.id);
        dispatcher.addNoReqData('contractId', contractId);
        dispatcher.addNoReqData('update', update);
        await dispatcher.handle();
    }
    useEffect(() => {
        setDocLoading(true);
        api.get(`contracts/${contractId}/executive-documents/get-one`)
            .then(({data}) => {
                setExecutiveDoc(data);
                setCourt(data.court);
                setBailiff(data.bailiff);
                setTypeId(data.typeId)

                // Получение данных об исполнительных производствах
                return api.get(`enforcement-proceedings/get-all/${data.id}`);
            })
            .then(({data}) => {
                setEnforcementProceedings(data);

            })
            .catch((error) => Alert.setError('Ошибка при получении данных', error))
            .finally(() => setDocLoading(false));
    }, []);

    return (
        <CustomModal customStyles={{width: 500}} show setShow={setShow}>
            {docLoading ? <Loading /> :
                <>
        <div className={'header_small'}>Изменение исполнительного документа</div>
        <form ref={formRef} onSubmit={onSubmit} >
            <div className={styles.executiveChoises__main}>
                {showCreateBailiff && <CreateBailiff setShow={setShowCreateBailiff} setNewValue={setBailiff} /> }
                {showCourtCreator.show && <CourtCreator setValue={setCourt} setShow={showCourtCreator.setShow} show={showCourtCreator.show} /> }
                <div className={styles.contentBlock}>
                    <SearchAndAddButton value={court} onClickAddButton={showCourtCreator.setShowTrue} serverAddress={'courts/findByName'} required setValue={setCourt} label='Суд, вынесший решение' />
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <SearchAndAddButton value={bailiff} serverAddress={'bailiffs-departments/search'} required setValue={setBailiff} label='Отдел судебных приставов-исполнителей' onClickAddButton={onClickCreateBailiff} />
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput size={'small'}  className={styles.smallInput} pattern='lessThenNow' defaultValue={executiveDoc.issued_date} type='date' name='issued_date' required label='дата ИД' />
                    <CustomInput size={'small'} customValidity={'номер в формате ББ№ЧЧЧЧЧЧЧЧ или Ч-ЧЧЧЧ/ЧЧЧЧ где Ч - это число, Б-это буква.'} className={styles.smallInput} pattern='(^[А-Яа-яЁё]{2}№\d+$)|^\d{1}-\d+\/\d{4}$'  defaultValue={executiveDoc.number} name='number' required label='Номер ИД' />
                </div>
                <div className={styles.contentBlock}>
                    <EasySelect name='typeId' onChange={(value)=>setTypeId(value)} variants={types} defaultValue={executiveDoc.typeId} label='Тип исполнительного документа *' />
                </div>
                <div className={styles.smallHeader}>Суммы подлежащие взысканию</div>
                <div className={styles.contentBlock}>
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={executiveDoc.main} name='main' variant='standard' pattern='float' required label='осн. долг' />
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={executiveDoc.percents} name='percents' variant='standard' pattern='float'  required label='Проценты' />
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={executiveDoc.penalties} name='penalties' variant='standard' pattern='float' required label='Неустойка' />
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={executiveDoc.fee} name='fee' variant='standard' pattern='float' required label='Госпошлина' />
                </div>
                <div className={styles.contentBlock}>
                    <div className={styles.content__link} onClick={() => showEnforcementProceedings.setShow(true)}>Исполнительное производство:</div>
                    {enforcementProceedings.length > 0 ? (
                        <div className={styles.smallInput}>
                            {`№: ${lastProceeding.number}, Дата: ${lastProceeding.begin_date}`}
                        </div>
                    ) : (
                        <div>Нет данных об исполнительном производстве</div>
                    )}
                </div>
                {showEnforcementProceedings.show &&
                    <CustomModal customStyles={{width: 600}} show setShow={showEnforcementProceedings.setShow}>
                        <EnforcementProceedings executiveDocId={executiveDoc.id} setShow={showEnforcementProceedings.setShow} />
                    </CustomModal>
                }

                {typeId === 2 &&
                    <div className={styles.contentBlock}>
                        <EasyInput className={styles.smallInput} required defaultValue={executiveDoc.resolutionNumber} name='resolutionNumber' size={'small'} variant='standard' label='номер решения' />
                        <EasyInput size={'small'} className={styles.smallInput} required defaultValue={executiveDoc.resolutionDate} InputLabelProps={{shrink: true}} name='resolutionDate' type='date' pattern='lessThenNow' variant='standard' label='дата решения' />
                    </div>
                }

            </div>
            {error && <div className="error">{error}</div>}
            <ButtonInForm loading={loading} />
            </form>
                </>
            }
        </CustomModal>

    );
};

export default ExecutiveDocChanger;
