import React, { useState } from 'react';
import styles from '../../css/agents.module.css';
import AgentsToolBar from './AgentsToolBar';
import ChangeAgent from './ChangeAgent';
import CustomList from "../dummyComponents/CustomList";

const headers = [{key: 'createdAt', name: 'Дата создания', type: 'date'}, {key: 'surname', name: 'Фамииля'}, {key: 'name', name: 'Имя'}, {key: 'patronymic' , name: 'Отчество'}, {key: "enclosure", name: "Документ"}];

const Agents = () => {
    const [update, setUpdate] = useState(false);
    const [changedAgentId, setChangedAgentId] = useState(false);
    const onClickRow = (id) => {
        setChangedAgentId(id);
    }
    return (
        <div className="firstWindow background">
            <div className="header">Управление представителями</div>
            <div className={"contentBox" + ' ' + styles.main}>
                <AgentsToolBar setUpdate={setUpdate}  />
                {changedAgentId && <ChangeAgent setUpdate={setUpdate} agent={changedAgentId} setShow={setChangedAgentId} /> }
                <CustomList headers={headers} serverAddress={'/agents/list'} update={update} setUpdate={setUpdate} onClickRow={onClickRow} />
            </div>
        </div>
    );
};

export default Agents;
