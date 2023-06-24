import React, { useRef, useState } from 'react';
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
import {Alert} from "@mui/material";

const useStyles = makeStyles({
    smallInput
})

const EnforcementProceedings = ({ data = {}, executiveDocId, setShow}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const formRef = useRef();
    const [enforcementProceedingStatus, setEnforcementProceedingStatus] = useState();
    const [bailiff, setBailiff] = useState();
    const [showCreateBailiff, setShowCreateBailiff] = useState(false);




    const onClickCreateBailiff = ()=>{
        setShowCreateBailiff(true)
    }


    const formSubmitHandler = async () => {
        setLoading(true);
        setError(false);
        try {
            const formData = new FormData(formRef.current);
            formData.append('enforcementProceedingStatus', enforcementProceedingStatus);
            formData.append('bailiff', bailiff.id);
            formData.append('executiveDocId', executiveDocId);

            //console.log(Object.fromEntries(formData.entries()));
            const { data } = await api.post('enforcement-proceedings/create', formData);
            dispatch(setAlert('Успешно'));
            setShow(false);

        } catch (error) {
            //console.log(error);
            Alert.setError('Возникла ошибка при отправке формы', error);
        } finally {
            setLoading(false);
        }
    }



    return (
        <div>
            <form ref={formRef}>

                {showCreateBailiff && <CreateBailiff setShow={setShowCreateBailiff} setNewItem={setBailiff} /> }
                <div className="small-inputs-box">
                    <EasyInput autoFocus label='дата начала исп. производства' className={classes.smallInput}  type='date' name='beginDate' required />
                    <EasyInput autoFocus label='дата окончания исп. производства' className={classes.smallInput}  type='date' name='endDate'  />
                </div>
                <div className="small-inputs-box">
                    <EasyInput label='Номер исп. производства' className={classes.smallInput} defaultValue={data.number} name='number' />
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <ServerSelect label='Статус исп. производства:' required value={enforcementProceedingStatus} serverAddress='enforcement-proceedings/search-status' setId={value => setEnforcementProceedingStatus(value)}/>

                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <SearchAndAddButton label='Судебный пристав:' required serverAddress='bailiffs/search' value={bailiff} setValue={setBailiff} onClickAddButton={onClickCreateBailiff}/>
                </div>
                <div className={styles.smallHeader}>Взысканные суммы</div>
                <div className={styles.contentBlock}>
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={''} name='main' variant='standard' pattern='float' required label='осн. долг' />
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={''} name='percents' variant='standard' pattern='float'  required label='Проценты' />
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={''} name='penalties' variant='standard' pattern='float' required label='Неустойка' />
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={''} name='fee' variant='standard' pattern='float' required label='Госпошлина' />
                </div>

                <ButtonInForm type='button' loading={loading} onClick={formSubmitHandler} />
            </form>
        </div>
    );
};

export default EnforcementProceedings;
