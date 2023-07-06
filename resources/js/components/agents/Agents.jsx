import React, { useState } from 'react';
import styles from '../../css/agents.module.css';
import AgentsToolBar from './AgentsToolBar';
import ChangeAgent from './ChangeAgent';
import CustomList from "../dummyComponents/CustomList";
import {useUpdate} from "../../hooks/useUpdate";

const headers = [
    {key: 'created_at', name: 'Дата создания', type: 'date'},
    {key: 'names.surname', name: 'Фамииля'},
    {key: 'names.name', name: 'Имя'},
    {key: 'names.patronymic' , name: 'Отчество'},
    {key: "enclosure", name: "Документ"}
];

const Agents = () => {
    const update = useUpdate();
    const [changedAgentId, setChangedAgentId] = useState(false);
    const onClickRow = (id) => {
        console.log(id)
        setChangedAgentId(id);
    }
    return (
        <div className="firstWindow background">
            <div className="header">Управление представителями</div>
            <div className={"contentBox" + ' ' + styles.main}>
                <AgentsToolBar setUpdate={update.set}  />
                {changedAgentId && <ChangeAgent setUpdate={update.set} agentId={changedAgentId} setShow={setChangedAgentId} /> }
                <CustomList headers={headers} serverAddress={'/agents/list'} update={update.state} onClickRow={onClickRow} />
            </div>
        </div>
    );
};

export default Agents;
