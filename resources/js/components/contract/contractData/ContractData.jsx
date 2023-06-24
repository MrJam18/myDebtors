import React, {useMemo, useState} from 'react';
import styles from '../../../css/contract.module.css';
import {useDispatch, useSelector} from 'react-redux';
import { contractsSelectors } from '../../../store/contracts/selectors';
import Toolbar from './Toolbar'
import ExecutiveDocChanger from './ExecutiveDocChanger';
import BaseColumner from "../../dummyComponents/Columns/BaseColumner";
import {contractColumns, creditContractColumns} from "../../../constants/contractColumns";
import {changeContract} from "../../../store/contracts/actions";
import {useShow} from "../../../hooks/useShow";
import CreditorChanger from "./CreditorChanger";


const ContractData = ({contractId, update}) => {
    const contract = useSelector(contractsSelectors.getCurrent);
    let columns = useMemo(()=> {
        if(contract.typeId === 1) return contractColumns;
        else return creditContractColumns;
    }, [contract]);
    const dispatch = useDispatch();
    const [showExecutiveDocChanger, setShowExecutiveDocChanger] = useState(false);
    const onClickExecutiveDoc = () => {
        setShowExecutiveDocChanger(true);
    }
    const showCreditorChanger = useShow(CreditorChanger, {update});
    const requestFunction = async (column, value) => {
       await dispatch(changeContract(column, value, contractId));
    }
    const setters = [{
        colName: 'executiveDocName',
        func: onClickExecutiveDoc
    },
        {
            colName: 'creditor',
            func: showCreditorChanger.setTrue
        }
    ];
    return (
        <div className={styles.content}>
            {showExecutiveDocChanger && <ExecutiveDocChanger update={update} setShow={setShowExecutiveDocChanger}/>}
            {showCreditorChanger.Comp()}
                <div className={styles.header_small}>Информация о договоре.</div>
                <Toolbar />
                <div className={styles.content__text}>
                    <BaseColumner data={contract} setters={setters} reqFunction={requestFunction} columns={columns} />
                </div>
            </div>
    );
};

export default ContractData;