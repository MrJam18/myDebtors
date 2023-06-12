import React, { useEffect, useRef, useState } from 'react';
import CustomModal from '../../dummyComponents/CustomModal';
import styles from '../../../css/contract.module.css'
import {TextField} from '@mui/material';
import Address from '../../dummyComponents/Address/Address';
import { useDispatch, useSelector } from 'react-redux';
import { getCourtsLevels, getCourtsTypes } from '../../../store/courts/selectors';
import EasySelect from '../../dummyComponents/EasySelect';
import { createCourt, recieveCourtLevels, recieveCourtTypes } from '../../../store/courts/actions';
import {formDataConverter} from '../../../utils/formDataConverter'
import { setAlert } from '../../../store/alert/actions';
import ButtonInForm from '../../dummyComponents/ButtonInForm'
import AddBanksRequisites from "../../AddBanksRequisites";
import CustomInput from "../../dummyComponents/CustomInput";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";
import {useError} from "../../../hooks/useError";


const CourtCreator = ({show, setShow, setValue = null}) => {
    const dispatch = useDispatch();
    const form = useRef();
    const error = useError();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState();
    const [addressError, setAddressError] = useState(false);
    const levels = useSelector(getCourtsLevels);
    const types = useSelector(getCourtsTypes);
    const [showAddBanksRequisites, setShowAddBanksRequisites] = useState(false);
    const [selectedBank, setSelectedBank] = useState(); // Изначально установлен как undefined или null
    const getNecessary =  () => {
        dispatch(recieveCourtTypes());
        dispatch(recieveCourtLevels());
    }

    useEffect(getNecessary, []);
    const onSubmit = async () => {
        console.log("Selected bank:", selectedBank);
        let data = formDataConverter(form.current.elements);
        data = {
            ...data,
            bankId: selectedBank.id,
        };
        if (!address) error.setError('Заполните адрес!');
        else {
            setLoading(true);
            error.setError(false);
            try{
                const court = await dispatch(createCourt(data, address));
                setValue({
                    name: court.name,
                    id: court.id
                });
                dispatch(setAlert('Успешно!', "Суд успешно добавлен!"));
                setShow(false);
            }
            catch(e){
                if(e?.response?.data?.message) error.setError(e.response.data.message);
                else error.setError(e.message);
            }
            setLoading(false)

        }
    }




    return (
        <div>
            <CustomModal show={show} setShow={setShow} customStyles={{width: 450}}>
                <div className={styles.courtCreator}>
                    <div className='header_small'>Создание суда.</div>
                    <form ref={form} >
                        <div className={styles.courtCreator__inputMargin}>
                            <TextField label='Название суда' variant='standard' required name='name' fullWidth />
                        </div>
                        <div className={styles.courtCreator__inputMargin}>
                            <EasySelect name='courtTypeId' label='Подведомственность' initValue={1} variants={types} />
                        </div>
                        <div className={styles.courtCreator__inputMargin}>
                            <EasySelect name='courtLevelId' label='Уровень' variants={levels} />
                        </div>
                        <div className={styles.blockHeader}>Банковские реквизиты</div>
                        <div className={styles.smallInputsHolder}>
                            <CustomInput customValidity='Счет должен состоять из 20 цифр!' pattern='^\d{20}$' className={styles.smallInput}  required={false} size='small' name='checking_account' label='Расчетный счет' variant='standard' />
                            <CustomInput customValidity='Счет должен состоять из 20 цифр!' pattern='^\d{20}$' className={styles.smallInput}  required={false} size='small' name='correspondent_account' label={'Корресп. счет'} variant='standard' />
                        </div>

                        <div className={styles.smallInputsHolder}>
                            <CustomInput customValidity='ИНН должен состоять из 10 цифр!' pattern='^\d{10}$' className={styles.smallInput}  required={false} size='small' name='inn' label={'ИНН'} variant='standard' />
                            <CustomInput customValidity='КПП должен состоять из 9 цифр!' pattern='^\d{9}$' className={styles.smallInput}  required={false} size='small' name='kpp' label={'КПП'} variant='standard' />

                        </div>
                        <div className={styles.smallInputsHolder}>
                            <CustomInput  className={styles.smallInput}  required={false} size='small' name='recipient' label={'Получатель'} variant='standard' />
                            <CustomInput customValidity='КБК должен состоять из 20 цифр!' pattern='^\d{20}$' className={styles.smallInput}  required={false} size='small' name='kbk' label={'КБК'} variant='standard' />
                        </div>
                        <div className={styles.courtCreator__inputMargin}>
                            <SearchAndAddButton
                                label='Банк получателя'
                                serverAddress='courts/search-bank-requisites'
                                onClickAddButton={()=>setShowAddBanksRequisites(true)}
                                required={false}
                                value={selectedBank} // Здесь мы передаем значение selectedBank
                                setValue={setSelectedBank} // Здесь мы передаем setSelectedBank как setValue
                            />
                        </div>
                        <div className={styles.courtCreator__inputMargin}>
                            <Address error={addressError} setError={setAddressError} setAddressForDB={setAddress} />
                        </div>
                        <ButtonInForm type='button' loading={loading} onClick={onSubmit} />
                    </form>
                    {error.Comp()}
                </div>
            </CustomModal>
            {showAddBanksRequisites && <AddBanksRequisites setShow={setShowAddBanksRequisites} />}
        </div>
    );
};

export default CourtCreator;
