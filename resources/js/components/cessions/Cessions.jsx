import React, {useEffect, useState} from 'react';
import styles from "../../css/cessions.module.css";
import Content from "../dummyComponents/Content";
import NoBorderTable from "../dummyComponents/NoBorderTable";
import {useDispatch, useSelector} from "react-redux";
import {cessionsSelector} from "../../store/cessions/selectors";
import {cessionsSlice} from "../../store/cessions/reducer";
import {recieveCessionsList} from "../../store/cessions/actions";
import CessionChanger from "./CessionChanger";
import {getIdByIndex} from "../../utils/getIdByIndex";
import AddButton from "./AddButton";
import CustomList from "../dummyComponents/CustomList";
import {useUpdate} from "../../hooks/useUpdate";
import {useShow} from "../../hooks/useShow";

const actions = cessionsSlice.actions;

const headers = [{key: "name", name: 'Название'}, {key: 'lastAssignor', name: 'Цедент'}, {key: 'lastAssignee', name: 'Цессионарий'}, {key: 'lastTransferDate', name: 'Дата цессии', type: 'date'}, {key: 'createdAt', name: "Дата создания"}];

const Cessions = () => {
    const update = useUpdate();
    // const loading = useSelector(cessionsSelector.getLoading);
    // const list = useSelector(cessionsSelector.getList);
    const showChanger = useShow();
    // const showInfo = useSelector(cessionsSelector.selectInfoShow);
    // const dispatch = useDispatch();
    // const [header, setHeader] = useState(false);

    // const onClickCession = (index)=> {
    //     dispatch(actions.setInfoCessionId(getIdByIndex(index, list.rows)));
    //     setHeader(list.rows[index].name);
    // }
    //
    // useEffect(async () => {
    //     await dispatch(recieveCessionsList());
    //     return ()=> {
    //         dispatch(actions.setLoading(true));
    //     }
    // }, []);

    return (
       <Content header={'Управление цессиями'} boxClassName={styles.main}>
           <div className={styles.cessionsToolbar}>
               <AddButton />
           </div>
           <CustomList headers={headers} serverAddress={'cessions/list'} update={update.state} />
           {/*<NoBorderTable headers={headers} loading={loading} rows={list.rows} rowsButtons onClickRow={onClickCession} />*/}
           {showChanger.state && <CessionChanger />}
       </Content>
    )
}


export default Cessions;