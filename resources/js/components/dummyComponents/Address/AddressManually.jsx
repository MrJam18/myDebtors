import React, { useRef } from 'react';
import styles from '../../../css/adress.module.css';
import { formDataConverter } from "../../../utils/formDataConverter";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomModal from "../CustomModal";
const AddressManually = ({ setShow, setAddress, setValue }) => {
    const formRef = useRef();
    const onSubmit = () => {
        var _a;
        if (formRef.current.reportValidity()) {
            const data = formDataConverter(formRef.current);
            setAddress(data);
            const value = `${data.country}, ${data.region}, ${data.area ? data.area + ', ' : ''}${data.settlement}, ${data.street}, ${data.house}, ${data.block ? data.block + ', ' : ''}${(_a = data.flat) !== null && _a !== void 0 ? _a : ''}`;
            setValue(value);
            setShow(false);
        }
    };
    return (<CustomModal setShow={setShow} header={'Ввод адреса вручную'}>
    <div className={styles.addressManually__main}>
        <form ref={formRef}>
        <div className={styles.addressManually__mergedInputs}>
            <CustomInput placeholder={'426000'} label={'Почтовый Индекс'} className={styles.addressManually__smallInput} name={'postal_code'}/>
            <CustomInput label={'Страна'} className={styles.addressManually__smallInput} name={'country'} placeholder={'Россия'}/>
        </div>
        <CustomInput label={'Регион'} className={styles.addressManually__input} name={'region'} placeholder={'Удмуртская респ'}/>
        <CustomInput required={false} label={'Район'} className={styles.addressManually__input} name={'area'} placeholder={'Завьяловский р-н'}/>
        <CustomInput label={'Населенный пункт'} className={styles.addressManually__input} name={'settlement'} placeholder={'г Ижевск'}/>
        <div className={styles.addressManually__mergedInputs}>
            <CustomInput label={'Улица'} size={'small'} className={styles.addressManually__smallInput} name={'street'} placeholder={'ул Петрова'}/>
            <CustomInput label={'Дом'} onEnter={onSubmit} size={'small'} className={styles.addressManually__smallInput} name={'house'} placeholder={'д 11'}/>
        </div>
        <div className={styles.addressManually__mergedInputs}>
            <CustomInput label={'Корпус'} required={false} onEnter={onSubmit} size={'small'} className={styles.addressManually__smallInput} name={'block'} placeholder={'корп 1'}/>
            <CustomInput label={'Квартира'} required={false} size={'small'} className={styles.addressManually__smallInput} onEnter={onSubmit} name={'flat'} placeholder={'кв 456'}/>
        </div>
        </form>
        <CustomButton onClick={onSubmit} type={"button"} text={'Сохранить'}/>
      </div>
  </CustomModal>);
};
export default AddressManually;
