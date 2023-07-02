import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import React, { useEffect, useState } from "react";
import styles from "../../css/customStepper.module.css";
import { useForwardRef } from "../../hooks/useForwardRef";
import ButtonInForm from "./ButtonInForm";
const CustomFormStepper = React.forwardRef(({ dataArray, setDataArray, setActiveData, getUpdatedData, children, setDeleteIds, onSubmit, defaultData = {}, onDeleteAll = null, onChangeStep = null, buttonText = 'Сохранить', defaultStep = null, loading = true, setIsNewDoc }, ref) => {
    const formRef = useForwardRef(ref);
    const [activeStep, setActiveStep] = useState(defaultStep !== null && defaultStep !== void 0 ? defaultStep : dataArray.length - 1);
    const [isArrayEmpty, setIsArrayEmpty] = useState(false);
    const stepChanger = (step, changedArr = null) => {
        if (!changedArr)
            changedArr = [...dataArray];
        changedArr[activeStep] = getUpdatedData();
        setDataArray(changedArr);
        setActiveStep(step);
        changeActiveData(changedArr[step]);
    };
    const handleNext = () => {
        if (activeStep < dataArray.length - 1) {
            stepChanger(activeStep + 1);
        }
    };
    const addNewData = () => {
        const newArr = [...dataArray];
        newArr.push(defaultData);
        setDataArray(newArr);
        return newArr;
    };
    const handleBack = () => {
        if (activeStep > 0) {
            stepChanger(activeStep - 1);
        }
    };
    const onDelete = () => {
        const deleteId = dataArray[activeStep].id;
        if (deleteId)
            setDeleteIds((deleteIds) => {
                deleteIds = [...deleteIds];
                deleteIds.push(deleteId);
                return deleteIds;
            });
        const currentStep = activeStep;
        setDataArray((dataArray) => {
            const changedArr = [...dataArray];
            changedArr.splice(currentStep, 1);
            const length = changedArr.length;
            if (currentStep === 0) {
                if (length)
                    stepChanger(0, changedArr);
            }
            else if (currentStep > length - 1) {
                setActiveStep(length - 1);
                changeActiveData(changedArr[length - 1]);
            }
            else {
                const activeData = changedArr[currentStep];
                changeActiveData(activeData);
            }
            return changedArr;
        });
    };
    const changeActiveData = (activeData) => {
        setActiveData(activeData);
        console.log(activeData);
        if (onChangeStep)
            onChangeStep(activeData);
    };
    const onAdd = () => {
        if (setIsNewDoc)
            setIsNewDoc(true);
        const newArr = addNewData();
        stepChanger(newArr.length - 1, newArr);
    };
    const onSubmitForm = (ev) => {
        ev.preventDefault();
        // @ts-ignore
        switch (ev.nativeEvent.submitter.getAttribute('datatype')) {
            case 'add':
                onAdd();
                break;
            case 'prev':
                handleBack();
                break;
            case 'next':
                handleNext();
                break;
            default:
                const sendingData = [...dataArray];
                sendingData[activeStep] = getUpdatedData();
                onSubmit(sendingData);
                break;
        }
    };
    useEffect(() => {
        if (dataArray.length === 0) {
            setIsArrayEmpty(true);
            const newArr = addNewData();
            newArr[0].isEmpty = true;
            changeActiveData(newArr[0]);
            setActiveStep(0);
        }
        else if (dataArray.length > 1 || dataArray.length === 1 && !dataArray[0].isEmpty)
            setIsArrayEmpty(false);
    }, [dataArray]);
    useEffect(() => {
        if (dataArray.length !== 0)
            changeActiveData(dataArray[activeStep]);
    }, []);
    return (<form onSubmit={onSubmitForm} ref={formRef}>
            <div className={styles.toolbar}>
                <div className={styles.toolbar__leftBox}>
                    {onDeleteAll &&
            <Button variant='contained' type='button' color='error' sx={{ width: '201px' }} onClick={onDeleteAll} className={styles.deleteButton}>удалить всё</Button>}
                </div>
                <div className={styles.toolbarBox}>
                    <Button variant='contained' type='button' sx={{ backgroundColor: '#346a9f' }} disabled={isArrayEmpty} onClick={onDelete} className={styles.toolbar__button}>Удалить</Button>
                    <Button variant='contained' type='submit' datatype='add' color='success' className={styles.toolbar__button}>добавить</Button>
                </div>
            </div>
            {children}
            <div className={'center'}>
                <MobileStepper variant="dots" steps={dataArray.length} position="static" activeStep={activeStep} sx={{ maxWidth: '60%', minWidth: '45%' }} nextButton={<Button size="small" type='submit' datatype='next' className={styles.bottomButton} disabled={activeStep === dataArray.length - 1}>
                            след.
                            <KeyboardArrowRight sx={{ paddingBottom: '4px' }}/>
                        </Button>} backButton={<Button size="small" type='submit' datatype='prev' className={styles.bottomButton} disabled={activeStep <= 0}>
                            <KeyboardArrowLeft sx={{ paddingBottom: '4px' }}/>
                            пред.
                        </Button>}/>
            </div>
            <ButtonInForm loading={loading} text={buttonText}/>
        </form>);
});
export default CustomFormStepper;
