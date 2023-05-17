import React, {useRef, useState} from 'react';
import styles from "../../css/orgs.module.css";
import {TextField} from "@mui/material";
import Address from "../dummyComponents/Address/Address";
import {makeStyles} from "@mui/styles";
import SearchAndAddButton from "../dummyComponents/search/SearchAndAddButton";
import {useMedia} from "../../hooks/useMedia";
import AddBanksRequisites from "./AddBanksRequisites";
import CustomInput from "../dummyComponents/CustomInput";
import {capitalize} from "../../utils/text/capitalize";
import ServerSelect from "../dummyComponents/ServerSelect";


const useStyles = makeStyles({
 fullInput: {
  marginBottom: '5px'
 },
 smallInput: {
  width: '46%'
 },
});
const humanCreditor = {
    nameLabel: 'ФИО Кредитора',
    shortLabel: 'Краткое название',
    courtId: {
        label: 'Серия и номер паспорта',
        pattern: '^\\d{4} \\d{6}$',
        validity: 'введите данные в формате чччч чччччч, где ч - это число.'
    }
}
const orgCreditor = {
    nameLabel: "Название кредитора",
    shortLabel: 'Краткое название кредитора',
    courtId: {
        label: 'ИНН',
        pattern: '^\\d{10}$',
        validity: 'ИНН должен состоять из 10 цифр.'
    }
}


const Creditor = ({defaultValues = {}, defaultRequisites = {}, setAddress, isOrg, setIsOrg, setFixedStyles, setBankRequisites, bankRequisites }) => {
 const classes = useStyles();
 const [showAddBanksRequisites, setShowAddBanksRequisites] = useState(false);
 const creditorProperties = isOrg ? orgCreditor : humanCreditor;
 const shortInputRef = useRef();
 const [shortInputLabelProps, setShortInputLabelProps] = useState(null);
 const onChangeType = (value) => {
  if(value === 3) setIsOrg(false);
  else setIsOrg(true);
 }
 const onBlurName = (ev) => {
     if(!isOrg) {
        const namesArray = ev.target.value.split(' ');
         if(namesArray?.length === 3) {
             shortInputRef.current.value = `${namesArray[0]} ${capitalize(namesArray[1][0])}. ${capitalize(namesArray[2][0])}.`;
             setShortInputLabelProps({shrink: true});
         }
         else {
             setShortInputLabelProps(null);
             shortInputRef.current.value = '';
         }
     }

 }
 useMedia('max-height: 650px', {bottom: '5px'}, setFixedStyles);
 return (
     <>
        <div className={styles.typeHolder}>
            <ServerSelect defaultId={defaultValues.type_id} label={'Тип кредитора'} name={'creditorTypeId'} serverAddress={'creditors/type-list'} setId={onChangeType} customClassName={styles.type} />
        </div>
        <TextField onBlur={onBlurName} className='inputs-box' defaultValue={defaultValues.name} required name='name' label={ creditorProperties.nameLabel} variant='standard' fullWidth />
         <div className='margin-bottom_10'>
             <div className={styles.smallInputsHolder}>
                 <TextField  className={classes.smallInput} InputLabelProps={shortInputLabelProps} inputRef={shortInputRef} defaultValue={defaultValues.short} name='short' label={creditorProperties.shortLabel} fullWidth variant='standard' />
                 <CustomInput className={classes.smallInput} defaultValue={defaultValues.court_identifier} required name='courtIdentifier' label={creditorProperties.courtId.label} pattern={creditorProperties.courtId.pattern} customValidity={creditorProperties.courtId.validity} />
             </div>
         </div>
        <Address setAddressForDB={setAddress} defaultValue={defaultValues.fullAddress} />
         <div className={styles.blockHeader}>Банковские реквизиты</div>
         <div className={styles.smallInputsHolder}>
             <CustomInput customValidity='Счет должен состоять из 20 цифр!' pattern='^\d{20}$' className={classes.smallInput} defaultValue={defaultRequisites.checking_account} required size='small' name='checkingAccount' label='Расчетный счет' variant='standard' />
             <CustomInput customValidity='Счет должен состоять из 20 цифр!' pattern='^\d{20}$' className={classes.smallInput} defaultValue={defaultRequisites.correspondent_account} required size='small' name='correspondentAccount' label={'Корресп. счет'} variant='standard' />
         </div>
            <div className="margin-bottom_10">
                <SearchAndAddButton label='Банк получателя' serverAddress='creditors/search-bank-requisites' onClickAddButton={()=> setShowAddBanksRequisites(true)} required value={bankRequisites} setValue={setBankRequisites} />
            </div>
         {showAddBanksRequisites && <AddBanksRequisites setShow={setShowAddBanksRequisites} />}
         </>
 );
};

export default Creditor;