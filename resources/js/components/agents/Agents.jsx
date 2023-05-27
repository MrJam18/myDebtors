import React, { useState } from 'react';
import styles from '../../css/agents.module.css';
import AgentsToolBar from './AgentsToolBar';
import ChangeAgent from './ChangeAgent';
import CustomList from "../dummyComponents/CustomList";
import {useUpdate} from "../../hooks/useUpdate";

const headers = [{key: 'createdAt', name: 'Дата создания', type: 'date'}, {key: 'surname', name: 'Фамииля'}, {key: 'name', name: 'Имя'}, {key: 'patronymic' , name: 'Отчество'}, {key: "enclosure", name: "Документ"}];

const Agents = () => {
    const update = useUpdate();
    const [changedAgentId, setChangedAgentId] = useState(false);
    const onClickRow = (idd) => {
        console.log(idd);
        setChangedAgentId(idd);
    }
    return (
        <div className="firstWindow background">
            <div className="header">Управление представителями</div>
            <div className={"contentBox" + ' ' + styles.main}>
                <AgentsToolBar setUpdate={update.set}  />
                {changedAgentId && <ChangeAgent setUpdate={update.set} agent={changedAgentId} setShow={setChangedAgentId} /> }
                <CustomList headers={headers} serverAddress={'/agents/list'} update={update.state} onClickRow={onClickRow} />
            </div>
        </div>
    );
};

export default Agents;
