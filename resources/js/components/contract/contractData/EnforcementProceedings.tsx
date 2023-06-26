import React, {useEffect, useRef, useState} from 'react';
import {useDispatcher} from "../../../hooks/useDispatcher";
import {useError} from "../../../hooks/useError";
import {IdNameType} from "../../../Types/IdNameType";
import {formDataConverter} from "../../../utils/formDataConverter";
import EasyInput from "../../dummyComponents/EasyInput";
import { makeStyles } from "@mui/styles";
import { smallInput } from '../../../constants/css';
import styles from "../../../css/contract.module.css";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";
import CreateBailiff from "./CreateBailiff";
import ServerSelect from "../../dummyComponents/ServerSelect";
import api from "../../../http";
import CustomModal from "../../dummyComponents/CustomModal";
import CustomFormStepper from "../../dummyComponents/CustomFormStepper";
import {getContractPath} from "../../../utils/getContractPath";
import {Alert} from "../../../classes/Alert";
import Loading from "../../dummyComponents/Loading";

const useStyles = makeStyles({
    smallInput
})

const EnforcementProceedings = ({ executiveDocId, setShow}) => {
    const [activeEnforcementProceeding, setActiveEnforcementProceeding] = useState<Record<string, any>>({});
    const [statusId, setStatusId] = useState(null);
    const [enforcementProceedings, setEnforcementProceedings] = useState([]);
    const [deleteIds, setDeleteIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const classes = useStyles();
    const error = useError();
    const formRef = useRef<HTMLFormElement>();
    const dispatcher = useDispatcher(error.setError, {setLoading: setButtonLoading, setShow, alertText: 'Исполнительное производство успешно сохранено'});
    const [bailiff, setBailiff] = useState<IdNameType>(null);
    const [showCreateBailiff, setShowCreateBailiff] = useState(false);
    const onSubmit = async (data: Array<Record<string, any>>)=> {
        // const sendingEnforcementProceedings = [...enforcementProceedings];
        // sendingEnforcementProceedings[activeStep] = getUpdatedData();
        // dispatcher.addData('enforcementProceedings', sendingEnforcementProceedings);
        dispatcher.addData('enforcementProceedings', data);
        dispatcher.addData('deleteIds', deleteIds);
        dispatcher.handle(getContractPath('enforcement-proceedings/set-all-by-executive-doc/' + executiveDocId), 'post');
    }
    const getUpdatedData = () => {
        if(formRef.current) {
            const data = formDataConverter(formRef.current);
            data.bailiff = bailiff;
            if (activeEnforcementProceeding.id) data.id = activeEnforcementProceeding.id;
            return data;
        }
    }
    const onClickCreateBailiff = ()=>{
        setShowCreateBailiff(true)
    }

    useEffect(()=> {
        api.get(getContractPath('enforcement-proceedings/get-list-by-executive-doc/' + executiveDocId))
            .then(({data}) => {
                if (Array.isArray(data) && data.length !== 0)  {
                    const last = data.length - 1;
                    const lastData = data[last];
                    setEnforcementProceedings(data);
                    // setActiveEnforcementProceeding(lastData);
                    // updateInputs(lastData);
                }
            })
            .catch((e) => Alert.setError('Ошибка при получении списка исп. производств', e))
            .finally(()=> setLoading(false));
    }, []);
    const updateInputs = (data: Record<string, any>)=> {
        if(formRef.current) {
            const elements = formRef.current.elements;
            updateElement('begin_date');
            updateElement('end_date');
            updateElement('number');
            updateElement('main');
            updateElement('percents');
            updateElement('fee');
            updateElement('penalties');
            setBailiff(data.bailiff);
            setStatusId(data.status_id ?? 0);
            function updateElement(property: string) {
                if (data[property]) elements[property].value = data[property];
                else elements[property].value = '';
            }
        }
    }
    return (
        <CustomModal customStyles={{width: 500}} setShow={setShow}>
            {loading ? <Loading/> : <>
                <CustomFormStepper
                    loading={buttonLoading}
                    onChangeStep={updateInputs}
                    getUpdatedData={getUpdatedData}
                    dataArray={enforcementProceedings}
                    setDataArray={setEnforcementProceedings}
                    setActiveData={setActiveEnforcementProceeding}
                    setDeleteIds={setDeleteIds}
                    onSubmit={onSubmit}
                    ref={formRef}
                >
                {showCreateBailiff &&
                    <CreateBailiff setShow={setShowCreateBailiff} setNewItem={setBailiff}/>}
                <div className="small-inputs-box">
                    <EasyInput shrink  autoFocus label='дата начала исп. производства'
                               className={classes.smallInput} type='date' name='begin_date' required/>
                    <EasyInput shrink autoFocus label='дата окончания исп. производства'
                               className={classes.smallInput} type='date' name='end_date'/>
                </div>
                <div className="small-inputs-box">
                    <EasyInput shrink label='Номер исп. производства'
                               className={classes.smallInput}
                               name='number'/>
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <ServerSelect id={statusId} name={'status_id'} label='Статус исп. производства:' serverAddress='enforcement-proceedings/search-status'/>
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <SearchAndAddButton label='Судебный пристав:' required serverAddress='bailiffs/search'
                                        value={bailiff} setValue={setBailiff}
                                        onClickAddButton={onClickCreateBailiff}/>
                </div>
                <div className={styles.smallHeader}>Взысканные суммы</div>
                <div className={styles.contentBlock}>
                    <EasyInput shrink className={styles.smallInput} size={'small'} name='main'
                               variant='standard' pattern='float' required label='осн. долг'/>
                    <EasyInput shrink className={styles.smallInput} size={'small'}
                               name='percents' variant='standard' pattern='float' required
                               label='Проценты'/>
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput shrink className={styles.smallInput} size={'small'}
                               name='penalties' variant='standard' pattern='float' required
                               label='Неустойка'/>
                    <EasyInput shrink className={styles.smallInput} size={'small'} name='fee'
                               variant='standard' pattern='float' required label='Госпошлина'/>
                </div>
                </CustomFormStepper>
                {error.Comp()}
            </>}
        </CustomModal>
    );
};

export default EnforcementProceedings;

