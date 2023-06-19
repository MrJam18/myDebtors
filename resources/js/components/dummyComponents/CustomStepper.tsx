import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import React, {useState} from "react";
import styles from "../../css/customStepper.module.css";

type Props = {
    dataArray: Array<Record<string, any>>,
    setDataArray: (dataArray: Array<Record<string, any>>) => void,
    defaultActiveStep?: number,
    children: React.ReactNode | React.ReactNode[],
    leftTopButtons?: React.ReactNode | React.ReactNode[],
    setActiveData: (data: Record<string, any>) => void,
    setDeleteIds: React.Dispatch<React.SetStateAction<Array<number>>>,
    onChangeStep?: (data: Record<string, any>) => void
}

const CustomStepper = ({ dataArray, setDataArray, setActiveData, defaultActiveStep = null, children, leftTopButtons = null, setDeleteIds, onChangeStep = null }: Props) => {
    const [activeStep, setActiveStep] = useState<number>(defaultActiveStep ?? dataArray.length - 1);
    const stepChanger = (step: number)=> {
        setActiveStep(step);
        const activeData = dataArray[step];
        setActiveData(activeData);
        if(onChangeStep) onChangeStep(activeData);
    }
    const handleNext = () => {
        if (activeStep < dataArray.length - 1) {
            stepChanger(activeStep + 1);
        }
    };

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
        handleBack();
        const changedArr = [...dataArray].splice(activeStep, 1);
        setDataArray(changedArr);
    }

    return (
        <>
            <div className={styles.toolbar}>
                <div className={styles.toolbar__leftBox}>
                    {leftTopButtons}
                </div>
                <div className={styles.toolbarBox}>
                    <Button variant='contained' type='button' sx={{backgroundColor: '#346a9f'}} disabled={dataArray.length <= 1} onClick={onDelete} className={styles.toolbar__button} >Удалить</Button>
                    <Button variant='contained' type='button' color='success' form='cessionData' name='add' className={styles.toolbar__button} >добавить</Button>
                </div>
            </div>
            {children}
        <MobileStepper
            variant="dots"
            steps={dataArray.length}
            position="static"
            activeStep={activeStep}
            sx={{maxWidth: 1000, flexGrow: 1}}
            nextButton={
                <Button size="small" type='button' onClick={handleNext} className={styles.bottomButton} disabled={activeStep === dataArray.length - 1}>
                    след.
                    <KeyboardArrowRight sx={{paddingBottom: '4px'}} />
                </Button>
            }
            backButton={
                <Button size="small" type='button' onClick={handleBack} className={styles.bottomButton} disabled={activeStep <= 0}>
                    <KeyboardArrowLeft sx={{paddingBottom: '4px'}} />
                    пред.
                </Button>
            }
        />
        </>
    );
};

export default CustomStepper