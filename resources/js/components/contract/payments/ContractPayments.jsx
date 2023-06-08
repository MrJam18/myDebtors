import { useParams } from 'react-router';
import styles from '../../../css/contract.module.css'
import React, { useState } from 'react';
import ChangePayment from "./ChangePayment";
import CustomList from "../../dummyComponents/CustomList";
import {useUpdate} from "../../../hooks/useUpdate";
import Toolbar from "./Toolbar";
import {useShow} from "../../../hooks/useShow";

const headers = [{name: 'Дата', key: 'date', type: 'date'},{ name: "Сумма", key: 'sum', type: 'number'}, {name: "Осн. долг", key: 'main', type: 'number'}, {name: "Проценты", key: 'percents', type: 'number'}, {name: "Неустойка", key: 'penalties', type: 'number'}];

const ContractPayments = () => {
    const {contractId} = useParams();
    const update = useUpdate();
    const [changedPayment, setChangedPayment] = useState(null);
    const showChangedPayment = useShow(ChangePayment, {payment: changedPayment, update: update.set});
    const onClickRow = () => {
        showChangedPayment.setShow(true);
    }


    return (
        <div className={styles.payments}>
            <div className={styles.header_small}>Управление платежами</div>
            <Toolbar update={update.set} />
            <CustomList headers={headers} serverAddress={'contracts/' + contractId + '/payments/list'} update={update.state} setElement={setChangedPayment} onClickRow={onClickRow} />
            {showChangedPayment.Comp()}
        </div>
    );
};




export default ContractPayments;
