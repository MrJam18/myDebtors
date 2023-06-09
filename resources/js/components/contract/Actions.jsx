import React, {useState} from 'react';
import { useParams } from 'react-router';
import styles from '../../css/contract.module.css'
import CustomList from "../dummyComponents/CustomList";
import {useUpdate} from "../../hooks/useUpdate";
import ListSearcher from "../dummyComponents/search/ListSearcher";

const headers = [{name: "Дата/время", key: 'created_at', type: 'date/time'}, {name: "Создатель", key: 'names.surname'}, {name: "Действие", key: 'action_types.name'} , {name: "Объект", key: 'action_objects.name'}, {name: "Результат", key: 'result', styles: {minWidth: '200px'}}];


const Actions = () => {
    const {contractId} = useParams();
    const [search, setSearch] = useState('');
    return (
        <div className={styles.actions}>
            <div className={styles.actionsList__toolbar}>
            <ListSearcher setSearch={setSearch} />
            </div>
            <div className={styles.header_small}>Действия договора</div>
            <CustomList headers={headers} search={search} serverAddress={`contracts/${contractId}/actions/list`} />
        </div>
    );
};

export default Actions;