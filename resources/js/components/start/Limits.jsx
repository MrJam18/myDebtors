import React from 'react';
import styles from '../../css/start.module.css';
import { useNavigate } from 'react-router';
import NoBorderTable from "../dummyComponents/NoBorderTable";
import MinPagination from "../dummyComponents/MinPagination";
import useList from "../../hooks/useList";

const headers = [{ key: 'date_issue', name: 'Дата выдачи' }, { key: 'debtor', name: 'Должник' }, { key: 'creditor', name: 'Кредитор' }, { key: 'limitation', name: 'Иск. давность (до)'}];

const Limits = ({perPage}) => {
    const navigate = useNavigate();
    const list = useList('contracts/limitationsList', {perPage: perPage});
    const onClickRow = (index) => {
        const element = list.get[index];
        if(element) navigate(`/contracts/${element.id}`);
    }
    return (<div className={styles.element}>
                <div className="header">Сроки исковой давности</div>
                <div className={styles.flexWrapper}>
                    <NoBorderTable onClickRow={onClickRow} headers={headers} loading={list.loading} rows={list.get} focus={list.order[0]} />
                    <MinPagination pageUpdater={list.setPage} limit={perPage} total={list.totalItems}/>
                </div>
            </div>);
};
export default Limits;
