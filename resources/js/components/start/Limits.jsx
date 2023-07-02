import React from 'react';
import styles from '../../css/start.module.css';
import { useNavigate } from 'react-router';
import NoBorderTable from "../dummyComponents/NoBorderTable";
import MinPagination from "../dummyComponents/MinPagination";
import useList from "../../hooks/useList";

const headers = [{ key: 'date_issue', name: 'Дата выдачи' }, { key: 'debtor', name: 'ФИО должника' }, { key: 'creditor', name: 'Название организации' }, { key: 'limitation', name: 'срок иск. давности (до)'}];

const Limits = () => {
    const navigate = useNavigate();
    const list = useList('contracts/limitationsList', {perPage: 10});
    const onClickRow = (index) => {
        const element = list.get[index];
        if(element) navigate(`/contracts/${element.id}`);
    }
    return (<div className={styles.element}>
                <div className="header">Сроки исковой давности</div>
                <div className={styles.flexWrapper}>
                    <NoBorderTable onClickRow={onClickRow} headers={headers} loading={list.loading} rows={list.get} focus={list.order[0]} />
                    <MinPagination pageUpdater={list.setPage} limit={10} total={list.totalItems}/>
                </div>
            </div>);
};
export default Limits;