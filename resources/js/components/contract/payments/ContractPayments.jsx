import { useParams } from 'react-router';
import styles from '../../../css/contract.module.css'
import React, { useState } from 'react';
import ChangePayment from "./ChangePayment";
import CustomList from "../../dummyComponents/CustomList";
import {useUpdate} from "../../../hooks/useUpdate";
import Toolbar from "./Toolbar";
import {useShow} from "../../../hooks/useShow";

const headers = [{name: 'Дата', key: 'date', type: 'date'},{ name: "Сумма", key: 'money_sums.sum', type: 'number'}, {name: "Осн. долг", key: 'money_sums.main', type: 'number'}, {name: "Проценты", key: 'money_sums.percents', type: 'number'}, {name: "Неустойка", key: 'money_sums.penalties', type: 'number'}];

const ContractPayments = () => {
    const {contractId} = useParams();
    const [changedPayment, setChangedPayment] = useState(null);
    const [search, setSearch] = useState('');
    const update = useUpdate();
    const showChangedPayment = useShow(ChangePayment, {payment: changedPayment, update: update.set});
    const onClickRow = () => {
        showChangedPayment.setShow(true);
    }


    return (
        <div className={styles.payments}>
            <div className={styles.header_small}>Управление платежами</div>
            <Toolbar setSearch={setSearch} update={update.set} />
            <CustomList search={search} headers={headers} serverAddress={'contracts/' + contractId + '/payments/list'} update={update.state} setElement={setChangedPayment} onClickRow={onClickRow} />
            {showChangedPayment.Comp()}
        </div>
    );
};




export default ContractPayments;
