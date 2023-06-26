import React from 'react';
import {TextField} from "@mui/material";
import styles from '../../../css/contract.module.css';
import EasyInput from "../../dummyComponents/EasyInput";
import EasySearch from "../../dummyComponents/search/EasySearch";
import {getContractPath} from "../../../utils/getContractPath";

const Payment = ({enforcementProceeding, setEnforcementProceeding, defaultValue = {}}) => {

 return (
  <>
      <div className='header_small' >Введите данные платежа</div>
   <TextField type='date' name='date' label='Дата платежа' defaultValue={defaultValue.date} InputLabelProps={{shrink: true}} required fullWidth size='small' className={styles.payment__input} />
      <EasyInput  label='сумма платежа' name='sum' pattern='float'  defaultValue={defaultValue.sum} required fullWidth size='small' className={styles.payment__input} variant='outlined' />
      <EasySearch serverAddress={getContractPath('enforcement-proceedings/search-list-by-contract')} setValue={setEnforcementProceeding} value={enforcementProceeding} inputVariant='outlined' className={styles.payment__input} label={'Исполнительное производство'} />
  </>
 );
};

export default Payment;