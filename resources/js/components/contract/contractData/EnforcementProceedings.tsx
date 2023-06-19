import React, {useEffect, useRef, useState} from 'react';
import {IdNameType} from "../../../Types/IdNameType";
import EasyInput from "../../dummyComponents/EasyInput";
import { makeStyles } from "@mui/styles";
import { smallInput } from '../../../constants/css';
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../css/contract.module.css";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";
import CreateBailiff from "./CreateBailiff";
import ServerSelect from "../../dummyComponents/ServerSelect";
import ButtonInForm from "../../dummyComponents/ButtonInForm";
import api from "../../../http";
import {setAlert} from "../../../store/alert/actions";
import CustomModal from "../../dummyComponents/CustomModal";
import CustomStepper from "../../dummyComponents/CustomStepper";
import {getContractPath} from "../../../utils/getContractPath";
import {Alert} from "../../../classes/Alert";
import Loading from "../../dummyComponents/Loading";

const useStyles = makeStyles({
    smallInput
})

const EnforcementProceedings = ({ executiveDocId, setShow}) => {
    const [activeEnforcementProceeding, setActiveEnforcementProceeding] = useState<Record<string, any>>({});
    const [enforcementProceedings, setEnforcementProceedings] = useState([]);
    const [deleteIds, setDeleteIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const dispatch = useDispatch();
    const beginDateRef = useRef();
    const endDateRef = useRef();
    const numberRef = useRef();
    const mainRef = useRef();
    const percentsRef = useRef();
    const penaltiesRef = useRef();
    const feeRef = useRef();
    const [enforcementProceedingStatus, setEnforcementProceedingStatus] = useState();
    const [bailiff, setBailiff] = useState<IdNameType>(null);
    const [showCreateBailiff, setShowCreateBailiff] = useState(false);


    const [searchKey, setSearchKey] = useState(0);
    // const clearForm = ()=>{
    //     beginDateRef.current.value = '';
    //     endDateRef.current.value = '';
    //     numberRef.current.value = '';
    //     setBailiff(undefined);
    //     setEnforcementProceedingStatus('');
    //     setSearchKey(prevKey => prevKey + 1);
    //     mainRef.current.value = '';
    //     percentsRef.current.value = '';
    //     penaltiesRef.current.value = '';
    //     feeRef.current.value = '';
    // }

    const onClickCreateBailiff = ()=>{
        setShowCreateBailiff(true)
    }

    const formSubmitHandler = async () => {
        console.log('bailiff before form submission:', bailiff);
        setLoading(true);

        try {
            const formData = new FormData(formRef.current);

            formData.append('enforcementProceedingStatus', enforcementProceedingStatus);
            formData.append('bailiff', String(bailiff.id));
            formData.append('executiveDocId', executiveDocId);

            const { data } = await api.post('enforcement-proceedings/create', formData);

            dispatch(setAlert('Успешно', 'сохранено'));

            setShow(false);

        } catch (error) {
            console.error('Возникла ошибка при отправке формы', error);

        } finally {

            setLoading(false);
        }
    }
    useEffect(()=> {
        api.get(getContractPath('enforcement-proceedings/get-list-by-executive-doc/' + executiveDocId))
            .then(({data}) => {
                if (data && Array.isArray(data))  {
                    setEnforcementProceedings(data);
                    if(data.length !== 0) setActiveEnforcementProceeding(data[data.length - 1]);
                }
            })
            .catch((e) => Alert.setError('Ошибка при получении списка исп. производств', e))
            .finally(()=> setLoading(false));
    }, []);

    return (
        <CustomModal customStyles={{width: 500}} setShow={setShow}>
            {loading ? <Loading/> :
                <CustomStepper dataArray={enforcementProceedings} setDataArray={setEnforcementProceedings}
                               setActiveData={setActiveEnforcementProceeding} setDeleteIds={setDeleteIds}>
                    <form ref={formRef} id='enforcementProceedingData'>
                        {showCreateBailiff &&
                            <CreateBailiff setShow={setShowCreateBailiff} setNewItem={setBailiff}/>}
                        <div className="small-inputs-box">
                            <EasyInput ref={beginDateRef} autoFocus defaultValue={activeEnforcementProceeding.begin_date} label='дата начала исп. производства'
                                       className={classes.smallInput} type='date' name='begin_date' required/>
                            <EasyInput ref={endDateRef} autoFocus label='дата окончания исп. производства'
                                       className={classes.smallInput} type='date' name='end_date'/>
                        </div>
                        <div className="small-inputs-box">
                            <EasyInput ref={numberRef} label='Номер исп. производства'
                                       className={classes.smallInput}
                                       name='number'/>
                        </div>
                        <div className={styles.executiveChoises__bailiffBlock}>
                            <ServerSelect label='Статус исп. производства:' serverAddress='enforcement-proceedings/search-status'/>
                        </div>
                        <div className={styles.executiveChoises__bailiffBlock}>
                            <SearchAndAddButton label='Судебный пристав:' required serverAddress='bailiffs/search'
                                                value={bailiff} setValue={setBailiff}
                                                onClickAddButton={onClickCreateBailiff}/>
                        </div>
                        <div className={styles.smallHeader}>Взысканные суммы</div>
                        <div className={styles.contentBlock}>
                            <EasyInput ref={mainRef} className={styles.smallInput} size={'small'} name='main'
                                       variant='standard' pattern='float' required label='осн. долг'/>
                            <EasyInput ref={percentsRef} className={styles.smallInput} size={'small'}
                                       name='percents' variant='standard' pattern='float' required
                                       label='Проценты'/>
                        </div>
                        <div className={styles.contentBlock}>
                            <EasyInput ref={penaltiesRef} className={styles.smallInput} size={'small'}
                                       name='penalties' variant='standard' pattern='float' required
                                       label='Неустойка'/>
                            <EasyInput ref={feeRef} className={styles.smallInput} size={'small'} name='fee'
                                       variant='standard' pattern='float' required label='Госпошлина'/>
                        </div>
                        {/*<div className={styles.buttonBlock}>*/}
                        {/*    <ButtonInForm type='button' loading={loading} onClick={formSubmitHandler} className={styles.addEnforcementProceeding}/>*/}
                        {/*    <Button variant='contained' color='success' name='add' onClick={clearForm}  className={styles.addEnforcementProceeding} >добавить</Button>*/}
                        {/*</div>*/}

                    </form>
                </CustomStepper>
            }
        </CustomModal>
    );
};

export default EnforcementProceedings;

