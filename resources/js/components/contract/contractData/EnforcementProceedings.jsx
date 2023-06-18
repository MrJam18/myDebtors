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
    const classes = useStyles();
    const dispatch = useDispatch();
    const formRef = useRef();
    const beginDateRef = useRef();
    const endDateRef = useRef();
    const numberRef = useRef();
    const mainRef = useRef();
    const percentsRef = useRef();
    const penaltiesRef = useRef();
    const feeRef = useRef();
    const [enforcementProceedingStatus, setEnforcementProceedingStatus] = useState();
    const [activeIndex, setActiveIndex] = useState(enforcementProceedingsArr.length - 1);
    let lastProceeding = enforcementProceedingsArr[activeIndex];
    const [bailiff, setBailiff] = useState({
        id: lastProceeding.bailiff.id,
        name: lastProceeding.bailiff.full_name
    });
    const [showCreateBailiff, setShowCreateBailiff] = useState(false);


    const [searchKey, setSearchKey] = useState(0);
    const clearForm = ()=>{
        beginDateRef.current.value = '';
        endDateRef.current.value = '';
        numberRef.current.value = '';
        setBailiff(undefined);
        setEnforcementProceedingStatus('');
        setSearchKey(prevKey => prevKey + 1);
        mainRef.current.value = '';
        percentsRef.current.value = '';
        penaltiesRef.current.value = '';
        feeRef.current.value = '';

    }


    // if (!lastProceeding) {
    //     if(enforcementProceedingsArr.length === 0){
    //         lastProceeding = {
    //             begin_date: '',
    //             number: '',
    //             status_id: '',
    //             bailiff: { id: '', name: { surname: '', name: '', patronymic: ''}},
    //             main: '',
    //             percents: '',
    //             penalties: '',
    //             fee: ''
    //         };
    //     } else {
    //         return <div>Loading...</div>;
    //     }
    // }



    const handleNext = () => {
        if (activeIndex < enforcementProceedingsArr.length - 1) {
            setActiveIndex((prevActiveIndex) => {
                setBailiff({
                    id: enforcementProceedingsArr[prevActiveIndex + 1].bailiff.id,
                    name: enforcementProceedingsArr[prevActiveIndex + 1].bailiff.full_name
                });
                return prevActiveIndex + 1;
            });
        }
    };

    const handleBack = () => {
        if (activeIndex > 0) {
            setActiveIndex((prevActiveIndex) => {
                setBailiff({
                    id: enforcementProceedingsArr[prevActiveIndex - 1].bailiff.id,
                    name: enforcementProceedingsArr[prevActiveIndex - 1].bailiff.full_name
                });
                return prevActiveIndex - 1;
            });
        }
    };



    const onClickCreateBailiff = ()=>{
        setShowCreateBailiff(true)
    }

    const formSubmitHandler = async () => {
        console.log('bailiff before form submission:', bailiff);
        setLoading(true);

        try {
            const formData = new FormData(formRef.current);

            formData.append('enforcementProceedingStatus', enforcementProceedingStatus);
            formData.append('bailiff', bailiff.id);
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

    return (
        <div>
            <form ref={formRef} id='enforcementProceedingData' key={activeIndex}>
                {showCreateBailiff && <CreateBailiff setShow={setShowCreateBailiff} setNewItem={setBailiff} />}
                <div className="small-inputs-box">
                    <EasyInput ref={beginDateRef} autoFocus label='дата начала исп. производства' className={classes.smallInput}  type='date' name='beginDate' required  defaultValue={lastProceeding.begin_date} />
                    <EasyInput ref={endDateRef} autoFocus label='дата окончания исп. производства' className={classes.smallInput}  type='date' name='endDate' defaultValue={lastProceeding.end_date} />
                </div>
                <div className="small-inputs-box">
                    <EasyInput ref={numberRef} label='Номер исп. производства' className={classes.smallInput} defaultValue={lastProceeding.number} name='number' />
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <ServerSelect key={activeIndex} defaultId={lastProceeding.status_id}  label='Статус исп. производства:' required value={enforcementProceedingStatus} serverAddress='enforcement-proceedings/search-status' setId={value => setEnforcementProceedingStatus(value)}/>
                </div>
                <div className={styles.executiveChoises__bailiffBlock}>
                    <SearchAndAddButton key={activeIndex} label='Судебный пристав:' required serverAddress='bailiffs/search' value={bailiff}  setValue={setBailiff} onClickAddButton={onClickCreateBailiff}/>
                </div>
                <div className={styles.smallHeader}>Взысканные суммы</div>
                <div className={styles.contentBlock}>
                    <EasyInput ref={mainRef} className={styles.smallInput} size={'small'} defaultValue={lastProceeding.main} name='main' variant='standard' pattern='float' required label='осн. долг' />
                    <EasyInput ref={percentsRef} className={styles.smallInput} size={'small'} defaultValue={lastProceeding.percents} name='percents' variant='standard' pattern='float'  required label='Проценты' />
                </div>
                <div className={styles.contentBlock}>
                    <EasyInput ref={penaltiesRef} className={styles.smallInput} size={'small'} defaultValue={lastProceeding.penalties} name='penalties' variant='standard' pattern='float' required label='Неустойка' />
                    <EasyInput ref={feeRef} className={styles.smallInput} size={'small'} defaultValue={lastProceeding.fee} name='fee' variant='standard' pattern='float' required label='Госпошлина' />
                </div>
                <MobileStepper
                    variant="dots"
                    steps={enforcementProceedingsArr.length}
                    position="static"
                    activeStep={activeIndex}
                    sx={{maxWidth: 1000, flexGrow: 1}}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeIndex === enforcementProceedingsArr.length - 1}>
                            след. производство
                            <KeyboardArrowRight sx={{paddingBottom: '4px'}} />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeIndex === 0}>
                            <KeyboardArrowLeft sx={{paddingBottom: '4px'}} />
                            пред. производство
                        </Button>
                    }
                />
                <div className={styles.buttonBlock}>
                    <ButtonInForm type='button' loading={loading} onClick={formSubmitHandler} className={styles.addEnforcementProceeding}/>
                    <Button variant='contained' color='success' name='add' onClick={clearForm}  className={styles.addEnforcementProceeding} >добавить</Button>
                </div>


            </form>
        </div>
    );
};

export default EnforcementProceedings;

