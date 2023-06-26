import React, {useEffect, useRef, useState} from 'react';
import styles from '../../../css/contract.module.css';
import { useSelector} from 'react-redux';
import {contractsSelectors} from "../../../store/contracts/selectors";
import EasySearch from "../../dummyComponents/search/EasySearch";
import api from "../../../http";
import ExecutiveDocChanger from "../contractData/ExecutiveDocChanger";
import {Alert} from "../../../classes/Alert";
// @ts-ignore
import {CreateIpInitDispatcher} from "../../../store/Dispatchers/Contracts/CreateIpInitDispatcher";
import ExecutiveDocChooser from "./choosers/ExecutiveDocChooser";

const ExecutiveChooses = ({setError, setLoading}) => {
    const formRef = useRef();
    const contract = useSelector(contractsSelectors.getCurrent);
    const [agent, setAgent] = useState({});
    const [executiveDoc, setExecutiveDoc] = useState({
        id: contract.executiveDocId,
        name: contract.executiveDocName
    });
    const [showExecutiveDocChooser, setShowExecutiveDocChooser] = useState(false);
    const onSubmit = async (ev) => {
        ev.preventDefault();
        const dispatcher = new CreateIpInitDispatcher(setError, setLoading);
        dispatcher.addData('executiveDocumentId', executiveDoc.id);
        dispatcher.addData('agentId', agent.id);
        dispatcher.handle();
    }
    useEffect(()=> {
        api.get('agents/get-default')
            .then(({data}) => {
                if(data) setAgent(data)
            })
            .catch((e) => Alert.setError('Ошибка при получении агента по умолчанию.', e));
        return ()=> {
            setAgent(null);
        }
    }, []);
    const onClickExecutiveDoc = () => {
        if(!executiveDoc.id) Alert.set('Нет исп. документа', "Сначала создайте исполнительный документ");
        else setShowExecutiveDocChooser(true);
    }
    return (
        <>
            <form id='submitSelectDocument' className={styles.documents__executiveChoosesMain} onSubmit={onSubmit} ref={formRef}>
            <div className={styles.smallHeader}>
                Исполнительный документ
            </div>
                <div className={styles.executiveChooses__ExecutiveDocName} onClick={onClickExecutiveDoc}>{contract.executiveDocName}</div>
                <h4 className={styles.smallHeader}>
                   Ф.И.О. представителя
                </h4>
                <EasySearch className={'margin-bottom_10 ' + styles.documents__selector} value={agent} setValue={setAgent} serverAddress={'agents/search-list'} required />
            </form>
                {showExecutiveDocChooser && <ExecutiveDocChooser setExecutiveDoc={setExecutiveDoc} setShow={setShowExecutiveDocChooser}  />}
        </>
    );
};

export default ExecutiveChooses;