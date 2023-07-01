import React, {useEffect, useRef, useState} from 'react';
import CustomModal from '../../dummyComponents/CustomModal';
import EasySelect from '../../dummyComponents/EasySelect';
import styles from '../../../css/contract.module.css';
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
import CustomFormStepper from "../../dummyComponents/CustomFormStepper";
import {formDataConverter} from "../../../utils/formDataConverter";
import {createUpdateElementsFunc} from "../../../utils/createUpdateElementFunc"

const types = [{name: 'Судебный приказ', id: 1}, {name: 'Исполнительный лист', id: 2}]


const ExecutiveDocChanger = ({setShow, update}) => {

    const [docLoading, setDocLoading] = useState(true);
    const [executiveDoc, setExecutiveDoc] = useState({});
    const [allDocs, setAllDocs] = useState();
    const [activeDoc, setActiveDoc] = useState();
    const formRef = useRef();
    const {contractId} = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bailiff, setBailiff] = useState(null);
    const [showCreateBailiff, setShowCreateBailiff] = useState(false);
    const [typeId, setTypeId] = useState(null);
    const [court, setCourt] = useState(executiveDoc.court);
    const [deleteIds, setDeleteIds] = useState([]);
    const showCourtCreator = useModal();
    const showEnforcementProceedings = useModal();
    const [lastEnforcementProceeding, setLastEnforcementProceeding] = useState();
    const onClickCreateBailiff = () => {
        setShowCreateBailiff(true);
    }

    const onSubmit = async (data) => {

        const dispatcher = new SetExecutiveDocumentDispatcher(setError, setLoading, formRef, setShow);
        dispatcher.addData('court', court);
        dispatcher.addData('bailiff', bailiff);
        dispatcher.addData('typeId', typeId);
        dispatcher.addData('id', executiveDoc.id);
        dispatcher.addData('deleteIds', deleteIds);
        dispatcher.addNoReqData('contractId', contractId);
        dispatcher.addNoReqData('update', update);
        await dispatcher.handle();
    }

    const getUpdatedData = () => {
        if (formRef.current) {
            const data = formDataConverter(formRef.current);
            data.bailiffDepartment = bailiff;
            data.court = court;
            data.enforcementProceedings = activeDoc.enforcementProceedings;
            if (activeDoc.id)
                data.id = activeDoc.id;

            return data;
        }
    };

    useEffect(() => {
        setDocLoading(true);

        api.get(`contracts/${contractId}/executive-documents/get-all`)
            .then(({data}) => {
                if(data) {
                    console.log('API',data)
                    const lastIndex = data.length - 1;
                    let lastDoc = data[lastIndex];
                    console.log('lastDoc',lastDoc)
                    setAllDocs(data);
                    setActiveDoc(lastDoc);
                    setCourt({
                        id: lastDoc.court.id,
                        name: lastDoc.court.name
                    });
                    setBailiff({
                        id: lastDoc.bailiffDepartment.id,
                        name: lastDoc.bailiffDepartment.name
                    });

                    setTypeId(lastDoc.type_id);


                    updateInputs(lastDoc);
                }
                })
            .catch((error) => Alert.setError('Ошибка при получении данных', error))
            .finally(() => setDocLoading(false));
    }, []);

    const updateInputs = (data)=>{
        console.log("updateInputs has been called with data:", data);
        let elements
        if (formRef.current) {
            elements = formRef.current;
            updateElement('issued_date');
            updateElement('main');
            updateElement('percents');
            updateElement('number');
            updateElement('penalties');
            updateElement('fee');
            setBailiff(data.bailiffDepartment);
            setCourt(data.court);
            setTypeId(data.type_id)

        }
        if (data.enforcementProceedings.length>0){
            let lastIndex = data.enforcementProceedings.length -1;
            setLastEnforcementProceeding(data.enforcementProceedings[lastIndex])
        }else setLastEnforcementProceeding(undefined)
        setActiveDoc(data);
        function updateElement(property) {
            if (data[property]) {
                console.log('ELEMENTS PROPERTY',elements[property] , 'value:', elements[property].value);
                elements[property].value = data[property];
            }
            else
                elements[property].value = '';
        }
    }
    useEffect(()=>{

        if (activeDoc && activeDoc.resolution_number){
            let elements = formRef.current;
            const updateElement = createUpdateElementsFunc(activeDoc, elements);
            updateElement('resolution_number');
            updateElement('resolution_date');
        }

    }, [activeDoc])

    return (
        <CustomModal customStyles={{width: 500}} show setShow={setShow}>
            {docLoading ? <Loading /> : <>
        <CustomFormStepper loading={loading} onChangeStep={updateInputs} dataArray={allDocs} setDataArray={setAllDocs} setActiveData={setActiveDoc} setDeleteIds={setDeleteIds} getUpdatedData={getUpdatedData} onSubmit={onSubmit} ref={formRef}>
        <div className={'header_small'}>Изменение исполнительного документа</div>

            <div className={styles.executiveChoises__main}>
                {showCreateBailiff && <CreateBailiff setShow={setShowCreateBailiff} setNewValue={setBailiff} /> }
                {showCourtCreator.show && <CourtCreator setValue={setCourt} setShow={showCourtCreator.setShow} show={showCourtCreator.show} /> }
                <div className={styles.contentBlock}>
                    <SearchAndAddButton value={court} onClickAddButton={showCourtCreator.setShowTrue} serverAddress={'courts/search-list'} required setValue={setCourt} label='Суд, вынесший решение' />
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <SearchAndAddButton value={bailiff} serverAddress={'bailiffs-departments/search'} required setValue={setBailiff} label='Отдел судебных приставов-исполнителей' onClickAddButton={onClickCreateBailiff} />
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput size={'small'}  className={styles.smallInput} pattern='lessThenNow' defaultValue={executiveDoc.issued_date} type='date' name='issued_date' required label='дата ИД' />
                    <CustomInput shrink size={'small'} customValidity={'номер в формате ББ№ЧЧЧЧЧЧЧЧ или Ч-ЧЧЧЧ/ЧЧЧЧ где Ч - это число, Б-это буква.'} className={styles.smallInput} pattern='(^[А-Яа-яЁё]{2}№\d+$)|^\d{1}-\d+\/\d{4}$'   name='number' required label='Номер ИД' />
                </div>
                <div className={styles.contentBlock}>
                    <EasySelect name='type_id' onChange={setTypeId} variants={types} value={typeId}  label='Тип исполнительного документа *' />
                </div>
                <div className={styles.smallHeader}>Суммы подлежащие взысканию</div>
                <div className={styles.contentBlock}>
                    <EasyInput shrink className={styles.smallInput} size={'small'}  name='main' variant='standard' pattern='float' required label='осн. долг' />
                    <EasyInput shrink className={styles.smallInput} size={'small'}  name='percents' variant='standard' pattern='float'  required label='Проценты' />
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput shrink className={styles.smallInput} size={'small'}  name='penalties' variant='standard' pattern='float' required label='Неустойка' />
                    <EasyInput shrink className={styles.smallInput} size={'small'}  name='fee' variant='standard' pattern='float' required label='Госпошлина' />
                </div>
                <div className={styles.contentBlock}>
                    <div className={styles.contentBlock}>Исполнительное производство:</div>
                    {lastEnforcementProceeding ? (
                        <div className={styles.content__link} onClick={() => showEnforcementProceedings.setShow(true)}>
                            {`№: ${lastEnforcementProceeding.number}, Дата: ${lastEnforcementProceeding.begin_date}`}
                        </div>
                    ) : (
                        <div className={styles.content__link} onClick={() => showEnforcementProceedings.setShow(true)}>Нет данных об исполнительном производстве</div>
                    )}
                </div>
                {((typeId == 2) || (activeDoc.type_id == 2)) && (
                    <div className={styles.contentBlock}>
                        <EasyInput shrink className={styles.smallInput} required name='resolution_number' size='small' variant='standard' label='номер решения' />
                        <EasyInput size='small' className={styles.smallInput} required InputLabelProps={{shrink: true}} name='resolution_date' type='date' pattern='lessThenNow' variant='standard' label='дата решения' />

                    </div>
                )}


            </div>

            {error && <div className="error">{error}</div>}



        </CustomFormStepper>
                </>
            }
            {showEnforcementProceedings.show && <EnforcementProceedings executiveDocId={activeDoc.id} setShow={showEnforcementProceedings.setShow} />
            }
        </CustomModal>

    );
};

export default ExecutiveDocChanger;
