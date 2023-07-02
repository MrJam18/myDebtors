import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useMemo, useState } from "react";
import styles from "../../css/addDebtor.module.css";
import { standardFontSize } from "../../utils/standardFontSize";
import { capitalizeFirstLetter } from "../../utils/text/capitalize";
import Address from "../dummyComponents/Address/Address";
import CustomCheckBox from "../dummyComponents/CustomCheckBox";
import ServerSelect from "../dummyComponents/ServerSelect";
const useStyles = makeStyles({
    input: {
        marginBottom: '4px',
        maxWidth: '225px',
    },
    checkbox: {
        width: '160px',
        lineHeight: 1.2,
        marginLeft: '55px',
        bottom: '-8px'
    },
    smallInput: {
        width: '225px',
    },
    button: {
        width: '50%',
        height: '35px',
    },
});
const standardInputMUISx = { '& .MuiInput-root': standardFontSize, '& .MuiInputLabel-root': standardFontSize };
const checkBoxInputProps = { tabIndex: '-1' };
const Debtor = ({ setAddressForDB, defaultValues = {} }) => {
    const classes = useStyles();
    const defNoPatronymic = useMemo(() => {
        if (typeof defaultValues.patronymic === 'undefined')
            return false;
        return !defaultValues.patronymic;
    }, [defaultValues]);
    const defNoBirthDate = useMemo(() => {
        if (typeof defaultValues.birth_date === 'undefined')
            return false;
        return !defaultValues.birth_date;
    }, [defaultValues]);
    const [noPatronymic, setNoPatronymic] = useState(defNoPatronymic);
    const [noBirthPlace, setNoBirthPlace] = useState(defNoBirthDate);
    const [passportTypeId, setPassportTypeId] = useState(defaultValues.type_id);
    const onBlurName = (ev) => {
        const value = ev.target.value;
        if (value)
            ev.target.value = capitalizeFirstLetter(value);
    };
    return (<>
            <div className={styles.debtor__block}>
                <div className={styles.header + ' ' + styles.header_first}>Информация о должнике</div>
                <div className="position_relative">
                    <TextField label='Фамилия' onBlur={onBlurName} defaultValue={defaultValues.surname} size='small' name='surname' required variant='standard' className={classes.input} sx={standardInputMUISx} fullWidth/>
                    <CustomCheckBox tabIndex={-1} inputProps={checkBoxInputProps} name='noBirthPlace' label='не знаю места рождения' className={classes.checkbox + ' ' + 'position_absolute'} checked={noBirthPlace} setChecked={setNoBirthPlace}/>
                </div>
                <div className="position_relative">
                    <TextField onBlur={onBlurName} defaultValue={defaultValues.name} label='Имя' size='small' required sx={standardInputMUISx} variant='standard' className={classes.input} fullWidth name='name'/>
                    <CustomCheckBox tabIndex={-1} inputProps={checkBoxInputProps} name='noPatronymic' label='нет отчества' className={classes.checkbox + ' ' + 'position_absolute'} checked={noPatronymic} setChecked={setNoPatronymic}/>
                </div>
                <div className="position_relative">
                    <TextField onBlur={onBlurName} defaultValue={defaultValues.patronymic} label='Отчество' size='small' name='patronymic' required variant='standard' className={classes.input} sx={standardInputMUISx} disabled={noPatronymic} fullWidth/>

                </div>
                <div className={styles.inputsFullWidthFlexBlock + ' margin-bottom_10'}>
                    <TextField label='Дата рождения' defaultValue={defaultValues.birth_date} name='birthDate' size='small' required InputLabelProps={{ shrink: true }} variant='standard' className={classes.smallInput} sx={standardInputMUISx} fullWidth type='date'/>
                    <TextField label='Место рождения' name='birthPlace' defaultValue={defaultValues.birth_place} size='small' required variant='standard' className={classes.smallInput} disabled={noBirthPlace} sx={standardInputMUISx} fullWidth/>
                </div>
                <div className="position_relative">
                </div>
            </div>
            <Address defaultValue={defaultValues.address} setAddressForDB={setAddressForDB}/>
            <div className={styles.passportBlock}>
                <div className={styles.passport__fullWidthInput + ' ' + styles.passport_block + ' ' + 'margin_0'}>
                    <ServerSelect name={'typeId'} label={'Паспортные данные'} setId={setPassportTypeId} defaultId={defaultValues.type_id} serverAddress={'debtors/passport-types'}/>
                </div>
                {passportTypeId === 1 && <>
                    <div className={styles.passport_block + ' ' + styles.inputsFullWidthFlexBlock}>
                        <TextField label='Серия' defaultValue={defaultValues.series} variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='series' className={classes.smallInput} sx={standardInputMUISx} required size='small'/>
                        <TextField label='Номер' variant="standard" sx={standardInputMUISx} defaultValue={defaultValues.number} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='number' className={classes.smallInput} required size='small'/>
                    </div>
                </>}
                {passportTypeId !== 1 && <>
                    <div className={styles.passport_block + ' ' + styles.inputsFullWidthFlexBlock}>
                        <TextField defaultValue={defaultValues.series} label='Серия' variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='series' className={classes.smallInput} sx={standardInputMUISx} required size='small'/>
                        <TextField label='Номер' variant="standard" defaultValue={defaultValues.number} sx={standardInputMUISx} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='number' className={classes.smallInput} required size='small'/>
                    </div>
                    <div className={styles.passport__fullWidthInput + ' ' + styles.passport_block}>
                        <TextField label='Выдан' defaultValue={defaultValues.issued_by} name='issue' sx={standardInputMUISx} variant="standard" fullWidth size='small'/>
                    </div>
                    <div className={styles.passport_block + ' ' + styles.inputsFullWidthFlexBlock}>
                        <TextField size='small' label='Дата выдачи' name='issueDate' defaultValue={defaultValues.issued_date} variant="standard" type='date' InputLabelProps={{ shrink: true }} sx={standardInputMUISx} className={classes.smallInput}/>
                        <TextField size='small' defaultValue={defaultValues.gov_unit_code} label='Код подразделения' sx={standardInputMUISx} variant="standard" name='govCode' className={classes.smallInput}/>
                    </div>
                </>}
            </div>
            </>);
};
export default Debtor;
