import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import React, {FormEvent, useEffect, useState} from "react";
import styles from "../../css/customStepper.module.css";
import {useForwardRef} from "../../hooks/useForwardRef";
import ButtonInForm from "./ButtonInForm";

type Data = Record<string, any>;

type Props = {
    dataArray: Array<Data>,
    setDataArray: React.Dispatch<React.SetStateAction<Array<Data>>>,
    children: React.ReactNode | React.ReactNode[],
    setActiveData: (data: Data) => void,
    setDeleteIds: React.Dispatch<React.SetStateAction<Array<number>>>,
    getUpdatedData: () => Data,
    onSubmit: (data: Array<Data>) => void,
    leftTopButtons?: React.ReactNode | React.ReactNode[],
    onChangeStep?: (data: Data) => void,
    defaultData?: Data,
    buttonText?: string,
    defaultStep?: number,
    loading?: boolean
}

const CustomFormStepper = React.forwardRef<HTMLFormElement, Props>((
    {
        dataArray,
        setDataArray,
        setActiveData,
        getUpdatedData,
        children,
        setDeleteIds,
        onSubmit,
        defaultData = {},
        leftTopButtons = null,
        onChangeStep = null,
        buttonText = 'Сохранить',
        defaultStep = null,
        loading = true
    }: Props, ref) => {
    const formRef = useForwardRef(ref);
    const [activeStep, setActiveStep] = useState(defaultStep ?? dataArray.length - 1);
    const stepChanger = (step: number, changedArr: Array<Record<any, any>> = null)=> {
        if(!changedArr) changedArr = [...dataArray];
        changedArr[activeStep] = getUpdatedData();
        setDataArray(changedArr);
        setActiveStep(step);
        const activeData = changedArr[step];
        changeActiveData(activeData);
    }
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
    }

    const handleBack = () => {
        if (activeStep > 0) {
            stepChanger(activeStep - 1);
        }
    };
    const onDelete = () => {
        const deleteId = dataArray[activeStep].id;
        if(deleteId) setDeleteIds((deleteIds) => {
            deleteIds = [...deleteIds];
            deleteIds.push(deleteId);
            return deleteIds;
        });
        const currentStep = activeStep;
        setDataArray((dataArray)=> {
            const changedArr = [...dataArray];
            changedArr.splice(currentStep, 1);
            const length = changedArr.length;
            if(currentStep === 0) {
                if(length === 0) changedArr.push(defaultData);
                else stepChanger(0, changedArr)
            }
            else if(currentStep > length - 1) {
                setActiveStep(length - 1);
                changeActiveData(changedArr[length - 1]);
            }
            else {
                const activeData = changedArr[currentStep];
                changeActiveData(activeData);
            }
            return changedArr;
        });
    }
    const changeActiveData = (activeData: Data) => {
        setActiveData(activeData);
        if(onChangeStep) onChangeStep(activeData);
    }
    const onAdd = () => {
        const newArr = addNewData();
        stepChanger(newArr.length - 1, newArr);
    }
    useEffect(() => {
        if(dataArray.length === 0) {
            const newArr = addNewData();
            stepChanger(0, newArr);
        }
    }, []);
    const onSubmitForm = (ev: FormEvent) => {
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
    }
    return (
        <form onSubmit={onSubmitForm} ref={formRef}>
            <div className={styles.toolbar}>
                <div className={styles.toolbar__leftBox}>
                    {leftTopButtons}
                </div>
                <div className={styles.toolbarBox}>
                    <Button variant='contained' type='button' sx={{backgroundColor: '#346a9f'}} disabled={dataArray.length <= 1} onClick={onDelete} className={styles.toolbar__button} >Удалить</Button>
                    <Button variant='contained' type='submit' datatype='add' color='success' className={styles.toolbar__button} >добавить</Button>
                </div>
            </div>
            {children}
            <div className={'center'}>
                <MobileStepper
                    variant="dots"
                    steps={dataArray.length}
                    position="static"
                    activeStep={activeStep}
                    sx={{maxWidth: '60%', minWidth: '45%'}}
                    nextButton={
                        <Button size="small" type='submit' datatype='next' className={styles.bottomButton} disabled={activeStep === dataArray.length - 1}>
                            след.
                            <KeyboardArrowRight sx={{paddingBottom: '4px'}} />
                        </Button>
                    }
                    backButton={
                        <Button size="small" type='submit' datatype='prev' className={styles.bottomButton} disabled={activeStep <= 0}>
                            <KeyboardArrowLeft sx={{paddingBottom: '4px'}} />
                            пред.
                        </Button>
                    }
                />
            </div>
            <ButtonInForm loading={loading} text={buttonText} />
        </form>
    );
});

export default CustomFormStepper;