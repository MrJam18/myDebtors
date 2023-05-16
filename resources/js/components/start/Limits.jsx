import React, { useEffect, useState } from 'react';
import NoBorderTable from '../dummyComponents/NoBorderTable';
import styles from '../../css/start.module.css';
import MinPagination from '../dummyComponents/MinPagination';
import { useNavigate } from 'react-router';
import useList from "../../hooks/useList";
const Limits = () => {
    const navigate = useNavigate();
    const list = useList('contracts/limitationsList', {perPage: 10});
    const focus = false;
    const headers = [{ key: 'date_issue', name: 'Дата выдачи' }, { key: 'debtor', name: 'ФИО должника' }, { key: 'creditor', name: 'Название организации' }, { key: 'limitation', name: 'срок иск. давности'}];
    const onClickRow = (index) => {
        // @ts-expect-error TS(2304): Cannot find name 'limitations'.
        navigate(`/contracts/${list.get[index].id}`);
    };
    return (<div className={styles.element}>
            <div className="header">Сроки исковой давности</div>
            <div className={styles.relativeContainer}>
                <div className={styles.content}>
                    <NoBorderTable loading={list.loading} headers={headers} rows={list.get} rowsButtons onClickRow={onClickRow} focus={focus} sortHandler={list.setOrder}/>
                </div>
                <div className={styles.paginationContainer}>
                    <MinPagination pageUpdater={list.setPage} total={list.totalItems}/>
                </div>
            </div>
        </div>);
};
export default Limits;