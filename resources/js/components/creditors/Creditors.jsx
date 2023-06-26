import React, {useState} from 'react';
import styles from '../../css/orgs.module.css';
import CreditorsToolBar from './CreditorsToolBar';
import CustomList from "../dummyComponents/CustomList";
import ChangeCreditor from "./ChangeCreditor";
import {useShow} from "../../hooks/useShow";

const headers = [
    {name: "Ид.", key: 'creditors.id'},
    {name: "Дата создания в базе", key: 'created_at', type: 'date'},
    {name: "Краткое название", key: 'short'},
    {name: "Полное название", key: 'name'},
    {name: 'Суд. идентификатор', key: 'court_identifier'},
    {name: 'Тип', key: 'type'}
];


const Creditors = () => {
    const [update, setUpdate] = useState(false);
    const [creditorId, setCreditorId] = useState(null);
    const showChangeCreditor = useShow();
    const [search, setSearch] = useState(null);
    const onClickRow = (id) => {
        setCreditorId(id);
        showChangeCreditor.setShow(true);
    }
    return (
        <div className="firstWindow background">
             <div className="header">Управление кредиторами</div>
            <div className={"contentBox" + ' ' + styles.main}>
                <div className="header_small">Список</div>
                <CreditorsToolBar setSearch={setSearch} setUpdate={setUpdate} />
                <CustomList search={search} update={update} onClickRow={onClickRow} setUpdate={setUpdate} headers={headers} serverAddress={'creditors/list'} />
            </div>
            {showChangeCreditor.state && <ChangeCreditor setUpdate={()=> setUpdate(true)} creditorId={creditorId} setShow={showChangeCreditor.setShow} />}
        </div>
    );
}

export default Creditors;