import styles from '../../css/start.module.css';
import {useNavigate} from "react-router";
import useList from "../../hooks/useList";
import NoBorderTable from "../dummyComponents/NoBorderTable";
import React from "react"
import MinPagination from "../dummyComponents/MinPagination";

const headers = [{ name: "Дата/Время", key: 'createdAt', type: 'date/time' }, { name: "Объект", key: 'actionObject' }, { name: "Результат", key: 'result', styles: { minWidth: '200px' } }];

const LastActions = ({perPage}) => {
    const navigate = useNavigate();
    const list = useList('actions/lastActions', {perPage: perPage});
    const onClickRow = (index) => {
        const element = list.get[index];
        if(element) navigate(`/contracts/${element.contractId}`);
    }

    return (<div className={styles.element}>
                <div className="header">Мои последние действия</div>
                    <div className={styles.flexWrapper}>
                        <NoBorderTable onClickRow={onClickRow} headers={headers} loading={list.loading} rows={list.get} focus={list.order[0]} />
                        <MinPagination pageUpdater={list.setPage} limit={perPage} total={list.totalItems}/>
                   </div>
        </div>);
};
export default LastActions;
