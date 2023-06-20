import React from 'react';
import { TextField} from "@mui/material";
import styles from '../../css/leftMenu.changer.module.css';
import Address from "../dummyComponents/Address/Address";
import EasyInput from "../dummyComponents/EasyInput";
import EasyCheckBox from "../dummyComponents/EasyCheckBox";

const Agent = ({defaultValues = {
    enclosure: 'Копия доверенности представителя'
}, setAddressForDB}) => {
    return (
        <>
            <div className={styles.flexWrapper}>
                <div className={styles.smallContainer}>
                <TextField className={styles.fullInput} required name='surname' label={"Фамилия"} variant='standard' defaultValue={defaultValues.surname} fullWidth />
                <TextField className={styles.fullInput} required name='name' label={'Имя'} fullWidth variant='standard' defaultValue={defaultValues.name} />
                <TextField className={styles.fullInput} defaultValue={defaultValues.patronymic} name='patronymic' label={'Отчество'} variant='standard' fullWidth />
                </div>
                <div className={styles.smallContainer}>
                    <EasyCheckBox name={'is_default'} rootStyles={{fontSize: '16px'}} className={styles.checkbox} size={'medium'} defaultValue={defaultValues.is_default} label="Представитель по умолчанию" />
                    <EasyCheckBox label="Не виден группе" name='no_show_group' defaultValue={defaultValues.no_show_group} rootStyles={{fontSize: '16px'}} className={styles.checkbox} size={'medium'} />
                    <TextField className={styles.fullInput} style={{marginTop: '6px'}} defaultValue={defaultValues.phone} name='phone' label={'Телефон'} variant='standard' required fullWidth />
                </div>
            </div>
            <Address setAddressForDB={setAddressForDB} defaultValue={defaultValues.fullAddress} />
            <TextField className={styles.fullInput} defaultValue={defaultValues.enclosure} fullWidth required name='enclosure' label='Документ, подтверждающий полномочия' variant='standard' />
            <div className={styles.smallInputsHolder}>
                <EasyInput defaultValue={defaultValues.passportSeries} label={'Серия паспорта'} name={'passportSeries'} className={styles.smallInput} required type={'number'} />
                <EasyInput defaultValue={defaultValues.passportNumber} label={'Номер паспорта'} name={'passportNumber'} className={styles.smallInput} required type={'number'} />
            </div>
        </>
    );
};

export default Agent;
