import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import styles from '../../css/addDebtor.module.css';
import { useState } from 'react';
import { useRef } from 'react';
import Address from '../dummyComponents/Address/Address';
import LoadingButton from '@mui/lab/LoadingButton';
import { standardFontSize } from "../../utils/standardFontSize";
import CustomModal from "../dummyComponents/CustomModal";
import { capitalizeFirstLetter } from "../../utils/text/capitalize";
import CustomCheckBox from "../dummyComponents/CustomCheckBox";
import { AddDebtorDispatcher } from "../../store/Dispatchers/Debtor/AddDebtorDispatcher";
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
const AddDebtor = ({ setAddDebtor, updateList }) => {
    const classes = useStyles();
    // const [fixedStyles, setFixedStyles] = useState({ top: '-65px' });
    const [noPatronymic, setNoPatronymic] = useState(false);
    const [noBirthPlace, setNoBirthPlace] = useState(false);
    const [passportTypeId, setPassportTypeId] = useState(1);
    const [isForeign, setIsForeign] = useState(false);
    const [addressForDB, setAddressForDB] = useState();
    const [loading, setLoading] = useState(false);
    const debtorForm = useRef();
    const [error, setError] = useState(false);
    const onBlurName = (ev) => {
        const value = ev.target.value;
        if (value)
            ev.target.value = capitalizeFirstLetter(value);
    };
    const formHandler = async (ev) => {
        ev.preventDefault();
        const dispatcher = new AddDebtorDispatcher(setError, setLoading, debtorForm);
        // dispatcher.data.passportType = passportType;
        dispatcher.data.address = addressForDB;
        await dispatcher.handle();
        setAddDebtor(false);
        updateList();
    };
    useEffect(() => {
        return () => {
            setNoPatronymic(false);
            setNoBirthPlace(false);
            setPassportTypeId(1);
            setAddressForDB(null);
            setError(false);
            setLoading(false);
        };
    }, []);
    return (
    // @ts-expect-error TS(2741): Property 'onClose' is missing in type '{ children:... Remove this comment to see the full error message
    <CustomModal header={'Создание должника'} show={true} customStyles={{ width: '40%', minWidth: '465px', maxWidth: '500px' }} setShow={setAddDebtor}>
            <form onSubmit={formHandler} ref={debtorForm}>
                <div className={styles.debtor__block}>
                <div className={styles.header + ' ' + styles.header_first}>Информация о должнике</div>
                    <div className="position_relative">
                        <TextField label='Фамилия' onBlur={onBlurName} size='small' name='surname' required variant='standard' className={classes.input} sx={standardInputMUISx} fullWidth/>

                        <CustomCheckBox setChecked={setIsForeign} tabIndex={-1} inputProps={checkBoxInputProps} name='isForeign' label='иностранный гражданин' className={classes.checkbox + ' ' + 'position_absolute'}/>
          </div>
          <div className="position_relative">
                        <TextField onBlur={onBlurName} label='Имя' size='small' required sx={standardInputMUISx} variant='standard' className={classes.input} fullWidth name='name'/>
              <CustomCheckBox tabIndex={-1} inputProps={checkBoxInputProps} name='noBirthPlace' label='не знаю места рождения' className={classes.checkbox + ' ' + 'position_absolute'} checked={noBirthPlace} setChecked={setNoBirthPlace}/>
          </div>
          <div className="position_relative">
                        <TextField onBlur={onBlurName} label='Отчество' size='small' name='patronymic' required variant='standard' className={classes.input} sx={standardInputMUISx} disabled={noPatronymic && true} fullWidth/>
              <CustomCheckBox tabIndex={-1} inputProps={checkBoxInputProps} name='noPatronymic' label='нет отчества' className={classes.checkbox + ' ' + 'position_absolute'} checked={noPatronymic} setChecked={setNoPatronymic}/>
          </div>
          <div className={styles.inputsFullWidthFlexBlock + ' margin-bottom_10'}>
              <TextField label='Дата рождения' name='birthDate' size='small' required InputLabelProps={{ shrink: true }} variant='standard' className={classes.smallInput} sx={standardInputMUISx} fullWidth type='date'/>
              <TextField label='Место рождения' name='birthPlace' size='small' required variant='standard' className={classes.smallInput} disabled={noBirthPlace && true} sx={standardInputMUISx} fullWidth/>
          </div>
          <div className="position_relative">
          </div>
        </div>
            <Address setAddressForDB={setAddressForDB}/>
             <div className={styles.passportBlock}>
        <div className={styles.passport__fullWidthInput + ' ' + styles.passport_block + ' ' + 'margin_0'}>
                <ServerSelect name={'typeId'} label={'Паспортные данные'} setId={setPassportTypeId} defaultId={1} serverAddress={'debtors/passport-types'} />
        </div>
                 {passportTypeId === 1 && <>
                     <div className={styles.passport_block + ' ' + styles.inputsFullWidthFlexBlock}>
                         <TextField label='Серия' variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='series' className={classes.smallInput} sx={standardInputMUISx} required size='small'/>
                         <TextField label='Номер' variant="standard" sx={standardInputMUISx} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='number' className={classes.smallInput} required size='small'/>
                     </div>
                 </>}
                 {passportTypeId !== 1 && <>
                     <div className={styles.passport_block + ' ' + styles.inputsFullWidthFlexBlock}>
                         <TextField label='Серия' variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='series' className={classes.smallInput} sx={standardInputMUISx} required size='small'/>
                         <TextField label='Номер' variant="standard" sx={standardInputMUISx} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name='number' className={classes.smallInput} required size='small'/>
                    </div>
                     <div className={styles.passport__fullWidthInput + ' ' + styles.passport_block}>
                     <TextField label='Выдан' name='issue' sx={standardInputMUISx} variant="standard" fullWidth size='small'/>
                     </div>
                     <div className={styles.passport_block + ' ' + styles.inputsFullWidthFlexBlock}>
                     <TextField size='small' label='Дата выдачи' name='issueDate' variant="standard" type='date' InputLabelProps={{ shrink: true }} sx={standardInputMUISx} className={classes.smallInput}/>
                     <TextField size='small' label='Код подразделения' sx={standardInputMUISx} variant="standard" name='govCode' className={classes.smallInput}/>
                     </div>
                     </>}
             </div>

    <div className='button_submit'><LoadingButton loading={loading} variant="contained" size="large" type='submit' className={classes.button}>
          Подтвердить
        </LoadingButton></div>
        {error && <div className={styles.error}>{error}</div>}
        </form>
        </CustomModal>);
};
export default AddDebtor;
//# sourceMappingURL=AddDebtor.jsx.map