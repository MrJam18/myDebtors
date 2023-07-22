import { useParams } from 'react-router';
import styles from '../../../css/contract.module.css'
import React, { useState, useEffect } from 'react';
import ChangePayment from "./ChangePayment";
import CustomList from "../../dummyComponents/CustomList";
import {useUpdate} from "../../../hooks/useUpdate";
import Toolbar from "./Toolbar";
import {useShow} from "../../../hooks/useShow";

const headers = [
    {name: 'Дата', key: 'payments.date', type: 'date'},
    {name: "Сумма", key: 'money_sums.sum', type: 'number'},
    {name: "Осн.", key: 'money_sums.main', type: 'number'},
    {name: "Проц.", key: 'money_sums.percents', type: 'number'},
    {name: "Неуст.", key: 'money_sums.penalties', type: 'number'},
    {name: 'Пошлина', key: 'money_sums.fee', type: 'number'},
    {name: 'Исп. пр-во', key: 'enforcement_proceedings.number'}
];

const ContractPayments = () => {
    const {contractId} = useParams();
    const [paymentId, setPaymentId] = useState(null);
    const [search, setSearch] = useState('');
    const update = useUpdate();
    const showChangedPayment = useShow(ChangePayment, {paymentId, update: update.set});
    const onClickRow = (id) => {
        setPaymentId(id);
        showChangedPayment.setShow(true);
    }
    return (
        <div className={styles.payments}>
            <div className={styles.header_small}>Управление платежами</div>
            <Toolbar setSearch={setSearch} update={update.set} />
            <CustomList defaultOrder={['payments.date', 'DESC']} search={search} headers={headers} serverAddress={'contracts/' + contractId + '/payments/list'} update={update.state} onClickRow={onClickRow} />
            {showChangedPayment.Comp()}
        </div>
    );
};




export default ContractPayments;
