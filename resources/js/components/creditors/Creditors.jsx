import React, {useState} from 'react';
import styles from '../../css/orgs.module.css';
import CreditorsToolBar from './CreditorsToolBar';
import CustomList from "../dummyComponents/CustomList";
import ChangeCreditor from "./ChangeCreditor";
import {useShow} from "../../hooks/useShow";



const Creditors = () => {
    const headers = [{name: "Дата создания в базе", key: 'created_at', type: 'date'}, {name: "Краткое название", key: 'short'}, {name: "Полное название", key: 'name'},
        {name: 'Суд. идентификатор', key: 'court_identifier'}, {name: 'Тип', key: 'type'}];
    const [update, setUpdate] = useState(false);
    const [creditorId, setCreditorId] = useState(null);
    const showChangeCreditor = useShow();
    const onClickRow = (id) => {
        console.log(id);
        setCreditorId(id);
        showChangeCreditor.setShow(true);
    }
    return (
        <div className="firstWindow background">
             <div className="header">Управление кредиторами</div>
            <div className={"contentBox" + ' ' + styles.main}>
                <div className="header_small">Список</div>
                <CreditorsToolBar setUpdate={setUpdate} />
                <CustomList update={update} onClickRow={onClickRow} setUpdate={setUpdate} headers={headers} serverAddress={'creditors/list'} />
            </div>
            {showChangeCreditor.state && <ChangeCreditor creditorId={creditorId} setShow={showChangeCreditor.setShow} />}
        </div>
    );
}

export default Creditors;