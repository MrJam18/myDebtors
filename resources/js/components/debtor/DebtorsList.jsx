import React, { useState } from "react";
import { Header } from "../../classes/Header";
import styles from "../../css/leftList.module.css";
import { useShow } from "../../hooks/useShow";
import { useUpdate } from "../../hooks/useUpdate";
import CustomList from "../dummyComponents/CustomList";
import ChangeDebtor from "./ChangeDebtor";
import DebtorsToolbar from "./DebtorsToolbar";
const headers = [
    new Header('Дата создания', 'debtors.created_at'),
    new Header('ФИО Должника', 'names.surname'),
    new Header('Дата рождения', 'debtors.birth_date'),
    new Header('Адрес', 'settlements.name')
];
const DebtorsList = ({}) => {
    const update = useUpdate();
    const [search, setSearch] = useState(null);
    const [debtorId, setDebtorId] = useState(null);
    const showChangeDebtor = useShow(ChangeDebtor, { debtorId, update: update.set });
    const onClickRow = (id) => {
        setDebtorId(id);
        showChangeDebtor.setTrue();
    };
    return (<div className="firstWindow">
            <div className="header">Управление должниками</div>
            <div style={{ maxWidth: '750px' }} className={"contentBox" + ' ' + styles.main}>
                <DebtorsToolbar setSearch={setSearch} update={update.set}/>
                <CustomList search={search} defaultOrder={['debtors.created_at', 'DESC']} update={update.state} onClickRow={onClickRow} headers={headers} serverAddress={'debtors/list'}/>
            </div>
            {showChangeDebtor.Comp()}
        </div>);
};
export default DebtorsList;
