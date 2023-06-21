import React, {useState} from 'react';
import styles from "../../css/cessions.module.css";
import Content from "../dummyComponents/Content";
import CessionChanger from "./CessionChanger";
import AddButton from "./AddButton";
import CustomList from "../dummyComponents/CustomList";
import {useUpdate} from "../../hooks/useUpdate";
import {useShow} from "../../hooks/useShow";
import ListSearcher from "../dummyComponents/search/ListSearcher";


const headers = [{key: 'cession_groups.name', name: 'Название'}, {key: 'assignor_table.short', name: 'Цедент'}, {key: 'assignee_table.short', name: 'Цессионарий'}, {key: 'ranked_table.transfer_date', name: 'Дата цессии', type: 'date'}, {key: 'cession_groups.created_at', name: "Дата создания"}];

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
           <CustomList defaultOrder={['cession_groups.created_at', 'DESC']} search={search} headers={headers} onClickRow={onClickRow} serverAddress={'cessions/list'} update={update.state} />
           {showChanger.Comp()}
       </Content>
    )
}


export default Cessions;