import React, {useEffect, useRef, useState} from 'react';
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
import Button from "@mui/material/Button";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import MobileStepper from "@mui/material/MobileStepper";

const useStyles = makeStyles({
    smallInput
})

const EnforcementProceedings = ({ data = {}, executiveDocId, setShow, enforcementProceedingsArr}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const formRef = useRef();
    const [enforcementProceedingStatus, setEnforcementProceedingStatus] = useState();
    const [bailiff, setBailiff] = useState();
    const [showCreateBailiff, setShowCreateBailiff] = useState(false);
    let lastProceeding = enforcementProceedingsArr[enforcementProceedingsArr.length - 1];
    console.log(lastProceeding);
    const [activeProceeding, setActiveProceeding] = useState(lastProceeding);
    const bailiffValue = {
        id: lastProceeding.bailiff.id,
        name: `${lastProceeding.bailiff.name.surname} ${lastProceeding.bailiff.name.name} ${lastProceeding.bailiff.name.patronymic}`
    };
    // Создание функции setProceedingForm
    const setProceedingForm = (proceeding) => {
        // здесь мы устанавливаем все состояния
        setNumber(proceeding.number);
        setBeginDate(proceeding.begin_date);
        setEndDate(proceeding.end_date);
        setSum(proceeding.sum);
        setMain(proceeding.main);
        setPercents(proceeding.percents);
        setPenalties(proceeding.penalties);
        setFee(proceeding.fee);
        setStatusDate(proceeding.status_date);
        setStatus({id: proceeding.status_id, name: proceeding.status_name});
        setBailiff({
            id: proceeding.bailiff.id,
            name: `${proceeding.bailiff.surname} ${proceeding.bailiff.name} ${proceeding.bailiff.patronymic}`,
        });
    }

// Использование useEffect для вызова setProceedingForm при изменении activeProceeding
    useEffect(() => {
        const activeProceedingData = enforcementProceedingsArr[activeProceeding];
        setProceedingForm(activeProceedingData);
    }, [activeProceeding, enforcementProceedingsArr]);


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
            <form ref={formRef} id='enforcementProceedingData'>

                {showCreateBailiff && <CreateBailiff setShow={setShowCreateBailiff} setNewItem={setBailiff} /> }
                <div className="small-inputs-box">
                    <EasyInput autoFocus label='дата начала исп. производства' className={classes.smallInput}  type='date' name='beginDate' required  defaultValue={lastProceeding.begin_date}/>
                    <EasyInput autoFocus label='дата окончания исп. производства' className={classes.smallInput}  type='date' name='endDate'  />
                </div>
                <div className="small-inputs-box">
                    <EasyInput label='Номер исп. производства' className={classes.smallInput} defaultValue={lastProceeding.number} name='number' />
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <ServerSelect defaultId={lastProceeding.status_id}  label='Статус исп. производства:' required value={enforcementProceedingStatus} serverAddress='enforcement-proceedings/search-status' setId={value => setEnforcementProceedingStatus(value)}/>
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <SearchAndAddButton label='Судебный пристав:' required serverAddress='bailiffs/search' value={bailiffValue}  setValue={setBailiff} onClickAddButton={onClickCreateBailiff}/>
                </div>
                <div className={styles.smallHeader}>Взысканные суммы</div>
                <div className={styles.contentBlock}>
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={lastProceeding.main} name='main' variant='standard' pattern='float' required label='осн. долг' />
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={lastProceeding.percents} name='percents' variant='standard' pattern='float'  required label='Проценты' />
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={lastProceeding.penalties} name='penalties' variant='standard' pattern='float' required label='Неустойка' />
                    <EasyInput className={styles.smallInput} size={'small'} defaultValue={lastProceeding.fee} name='fee' variant='standard' pattern='float' required label='Госпошлина' />
                </div>
                <MobileStepper
                    variant="dots"
                    steps={enforcementProceedingsArr.length} //
                    position="static"
                    activeStep={activeProceeding}
                    sx={{maxWidth: 1000, flexGrow: 1}}
                    nextButton={
                        <Button
                            form='enforcementProceedingData'
                            type='submit'
                            size="small"
                            onClick={() => setActiveProceeding((prev) => Math.min(prev + 1, enforcementProceedingsArr.length - 1))} // Увеличиваем activeProceeding, но не позволяем ему превысить длину массива
                            disabled={activeProceeding === enforcementProceedingsArr.length - 1}
                        >
                            след. исп. производство
                            <KeyboardArrowRight sx={{paddingBottom: '4px'}} />
                        </Button>
                    }
                    backButton={
                        <Button
                            form='enforcementProceedingData'
                            type='submit'
                            size="small"
                            onClick={() => setActiveProceeding((prev) => Math.max(prev - 1, 0))} // Уменьшаем activeProceeding, но не позволяем ему стать меньше 0
                            disabled={activeProceeding === 0}
                        >
                            <KeyboardArrowLeft sx={{paddingBottom: '4px'}} />
                            пред. исп. производство
                        </Button>
                    }
                />


                <ButtonInForm type='button' loading={loading} onClick={formSubmitHandler} />
            </form>
        </div>
    );
};

export default EnforcementProceedings;
