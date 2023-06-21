import React, {useState} from 'react';
import styles from "../../css/cessions.module.css";
import Content from "../dummyComponents/Content";
import CessionChanger from "./CessionChanger";
import AddButton from "./AddButton";
import CustomList from "../dummyComponents/CustomList";
import {useUpdate} from "../../hooks/useUpdate";
import {useShow} from "../../hooks/useShow";
import ListSearcher from "../dummyComponents/search/ListSearcher";


const headers = [
    {key: "name", name: 'Название'},
    {key: 'lastAssignor', name: 'Цедент'},
    {key: 'lastAssignee', name: 'Цессионарий'},
    {key: 'lastTransferDate', name: 'Дата цессии', type: 'date'},
    {key: 'created_at', name: "Дата создания"}];

const Cessions = () => {
    const update = useUpdate();
    const [cessionId, setCessionId] = useState(null);
    const [search, setSearch] = useState('');
    const showChanger = useShow(CessionChanger, {cessionId, update: update.set});
    const onClickRow = (id) => {
        setCessionId(id);
        showChanger.setShow(true);
    }
    return (
       <Content header={'Управление цессиями'} boxClassName={styles.main}>
           <div className={styles.cessionsToolbar}>
               <ListSearcher setSearch={setSearch} />
               <AddButton update={update.set} />
           </div>
           <CustomList search={search} headers={headers} onClickRow={onClickRow} serverAddress={'cessions/list'} update={update.state} />
           {showChanger.Comp()}
       </Content>
    )
}


export default Cessions;
