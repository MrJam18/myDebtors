import React, {useState} from 'react';
import styles from "../../css/cessions.module.css";
import Content from "../dummyComponents/Content";
import CessionChanger from "./CessionChanger";
import CustomList from "../dummyComponents/CustomList";
import {useUpdate} from "../../hooks/useUpdate";
import {useShow} from "../../hooks/useShow";
import ListSearcher from "../dummyComponents/search/ListSearcher";
import AddButton from "../dummyComponents/AddButton";


const headers = [
    {key: 'cession_groups.created_at', name: "Дата создания"},
    {key: 'cession_groups.name', name: 'Название'},
    {key: 'assignor_table.short', name: 'Цедент'},
    {key: 'assignee_table.short', name: 'Цессионарий'},
    {key: 'ranked_table.transfer_date', name: 'Дата цессии', type: 'date'},
    {key: 'cession_groups.id', name: 'Ид.'},
    ];


const Cessions = () => {
    const update = useUpdate();
    const [cessionId, setCessionId] = useState(null);
    const [search, setSearch] = useState('');
    const showChanger = useShow(CessionChanger, {cessionGroupId: cessionId, update: update.set});
    const onClickRow = (id) => {
        setCessionId(id);
        showChanger.setShow(true);
    }
    const onClickAdd = () => {
        setCessionId(null);
        showChanger.setTrue();
    }
    return (
       <Content header={'Управление цессиями'} boxClassName={styles.main}>
           {showChanger.Comp()}
           <div className={styles.cessionsToolbar}>
               <ListSearcher setSearch={setSearch} />
               <AddButton onClick={onClickAdd} />
           </div>
           <CustomList defaultOrder={['cession_groups.created_at', 'DESC']} search={search} headers={headers} onClickRow={onClickRow} serverAddress={'cessions/list'} update={update.state} />
       </Content>
    )
}


export default Cessions;