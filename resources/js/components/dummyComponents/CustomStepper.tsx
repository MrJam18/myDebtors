import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import React, {useEffect, useState} from "react";
import styles from "../../css/customStepper.module.css";

type Data = Record<string, any>;

type Props = {
    dataArray: Array<Data>,
    setActiveData: (data: Data) => void,
    onChangeStep?: (data: Data) => void,
    defaultStep?: number,
}

const CustomStepper = ({dataArray, setActiveData, onChangeStep = null, defaultStep = null}: Props) => {
    const [activeStep, setActiveStep] = useState<number>(defaultStep ?? dataArray.length - 1);
    const stepChanger = (step: number)=> {
        setActiveStep(step);
        changeActiveData(dataArray[step]);
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
    const changeActiveData = (activeData: Data) => {
        setActiveData(activeData);
        if(onChangeStep) onChangeStep(activeData);
    }
    useEffect(()=> {
        changeActiveData(dataArray[activeStep]);
    }, [dataArray]);
    
    return (
        <div className={'center'}>
            <MobileStepper
                variant="dots"
                steps={dataArray.length}
                position="static"
                activeStep={activeStep}
                sx={{maxWidth: '60%', minWidth: '45%'}}
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
        </div>
        );
}

export default CustomStepper