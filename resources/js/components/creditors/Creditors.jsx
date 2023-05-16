import React from 'react';
import styles from '../../css/orgs.module.css';
import CreditorsToolBar from './CreditorsToolBar';
import CustomList from "../dummyComponents/CustomList";



const Creditors = () => {
    const headers = [{name: "Дата создания в базе", key: 'created_at', type: 'date'}, {name: "Краткое название", key: 'short'}, {name: "Полное название", key: 'name'},
        {name: 'Суд. идентификатор', key: 'courtIdentifier'}, {name: 'Тип', key: 'type'}];
    return (
        <div className="firstWindow background">
             <div className="header">Управление кредиторами</div>
            <div className={"contentBox" + ' ' + styles.main}>
                <div className="header_small">Cписок</div>
                <CreditorsToolBar />
                <CustomList headers={headers} serverAddress={'creditors/list'} />
            </div>
        </div>
    );
};

export default Creditors;