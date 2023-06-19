import React from 'react';
import Button from "@mui/material/Button";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import MobileStepper from "@mui/material/MobileStepper";

const DataStepper = ({ dataArray, activeStep, onStepChange }) => {

    const handleNext = () => {
        if (activeStep < dataArray.length - 1) {
            onStepChange(activeStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            onStepChange(activeStep - 1);
        }
    };

    return (
        <MobileStepper
            variant="dots"
            steps={dataArray.length}
            position="static"
            activeStep={activeStep}
            sx={{maxWidth: 1000, flexGrow: 1}}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === dataArray.length - 1}>
                    следующее
                    <KeyboardArrowRight sx={{paddingBottom: '4px'}} />
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    <KeyboardArrowLeft sx={{paddingBottom: '4px'}} />
                    предидущее
                </Button>
            }
        />
    );
};

export default DataStepper;
