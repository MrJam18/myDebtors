import { MenuItem } from '@mui/material';
import React, {useEffect, useState} from 'react';
import CustomSelect from '../../dummyComponents/CustomSelect';
import CourtChooses from './CourtChooses';
import styles from '../../../css/contract.module.css'
import ButtonInForm from '../../dummyComponents/ButtonInForm';
import ExecutiveChooses from './ExecutiveChooses';
import {useError} from "../../../hooks/useError";
import {useParams} from "react-router";

const docTypes = [{value: 'courtOrder', label: 'Заявление о выдаче судебного приказа', id: 1}, {value: 'claim', label: "Исковое заявление", id: 2}, {value: 'IDReqCourt', label: "Запрос на получение исп. документа у суда"}, {value: 'IPInit', label: "Заявление о возбуждении ИП"}, {value: 'IPIntrod', label: "Заявление об ознакомлении с материалами ИП"}, {value: 'reqDeliveryID', label: "Заявление о выдаче ИД после окончания ИП" }];

const NoParams = ()=> <div className={styles.selectedDoc__noParams}>Нет дополнительных параметров</div>;

const Documents = () => {
    const error = useError();
    const [loading, setLoading] = useState(false);
    const {contractId} = useParams();
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [additionalShow, setAdditionalShow] = useState('');

    useEffect(()=> {
        return ()=> {
            setAdditionalShow('');
            error.noError();
        }
    }, []);
    const paramsHandler = (val) => {
        switch(val){
            case 'courtOrder':
            case 'claim':
                setAdditionalShow('courtChooses');
             break;   
            case 'IPInit':
                setAdditionalShow('executiveChooses');
                break;
            default:
                setAdditionalShow('');
                break;
        }
    }
    const onChangeDocTypes = (val) => {
        const found = docTypes.find((el)=> el.value === val);
        setSelectedDoc(found);
        paramsHandler(val);
    }
    const rows = docTypes.map((el)=> {
        return (<MenuItem value={el.value}> {el.label} </MenuItem>)
    });
    return (
        <div className={styles.documents}>
            <div className="header_small">Управление документами</div>
            <div className={styles.documents__selectorHolder}>
                <CustomSelect name='document' customClassName={styles.documents__selector} onChange={onChangeDocTypes} label='Выберите документ из списка' >{rows}</CustomSelect>
            </div>
            <div className={styles.documents__header}>Дополнительные параметры</div>
            {additionalShow === 'courtChooses' && <CourtChooses contractId={contractId} setLoading={setLoading} setError={error.setError}  selectedDoc={selectedDoc} /> }
            {additionalShow === '' && <NoParams />}
            {additionalShow === 'executiveChooses' && <ExecutiveChooses contractId={contractId} setLoading={setLoading} setError={error.setError} />}
            <ButtonInForm disabled={additionalShow===''} formId='submitSelectDocument' loading={loading} customClassName={styles.selectDocument__button} />
            {error.Comp()}
        </div>
    );
};

export default Documents;