import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert } from "../../../classes/Alert";
import styles from "../../../css/contract.module.css";
import { useDispatcher } from "../../../hooks/useDispatcher";
import { useShow } from "../../../hooks/useShow";
import api, { saveFile } from "../../../http/index";
import { contractsSelectors } from "../../../store/contracts/selectors";
import { getContractPath } from "../../../utils/getContractPath";
import Loading from "../../dummyComponents/Loading";
import EasySearch from "../../dummyComponents/search/EasySearch";
import EnforcementProceedings from "../contractData/EnforcementProceedings";
const EnforcementProceedingChooses = ({ selectedDoc, setError, setLoading }) => {
    const contract = useSelector(contractsSelectors.getCurrent);
    const [enforcementProceeding, setEnforcementProceeding] = useState(null);
    const [currentLoading, setCurrentLoading] = useState(true);
    const [agent, setAgent] = useState(null);
    const dispatcher = useDispatcher(setError, {
        setLoading, request: (serverAddress) => saveFile(serverAddress),
    });
    const showEnforcementProceedings = useShow(EnforcementProceedings, { executiveDocId: contract.executiveDocId });
    const onSubmit = (ev) => {
        ev.preventDefault();
        dispatcher.handle(getContractPath(`documents/${selectedDoc.value}?enforcementProceedingId=${enforcementProceeding.id}&agentId=${agent.id}`), 'get');
    };
    useEffect(() => {
        if (!contract.executiveDocId) {
            setError('Сначала создайте исполнительный документ и исполнительное производство');
            setCurrentLoading(false);
        }
        else {
            api.get(getContractPath('enforcement-proceedings/get-last-and-default-agent/' + contract.executiveDocId))
                .then(({ data }) => {
                if (data) {
                    setEnforcementProceeding(data.enforcementProceeding);
                    setAgent(data.agent);
                }
            })
                .catch(e => Alert.setError('Ошибка при получении данных', e))
                .finally(() => setCurrentLoading(false));
        }
    }, []);
    return (<>
            {showEnforcementProceedings.Comp()}
            {currentLoading ? <Loading /> :
            <form id='submitSelectDocument' className={styles.documents__executiveChoosesMain} onSubmit={onSubmit}>
                    <h4 className={styles.smallHeader}>
                        Исполнительное производство
                    </h4>
                    <EasySearch className={'margin-bottom_10 ' + styles.documents__selector} serverAddress={getContractPath('enforcement-proceedings/search-list-by-contract')} setValue={setEnforcementProceeding} value={enforcementProceeding} required/>
                    <h4 className={styles.smallHeader}>
                        Представитель
                    </h4>
                    <EasySearch className={'margin-bottom_10 ' + styles.documents__selector} value={agent} setValue={setAgent} serverAddress={'agents/search-list'} required/>
                </form>}
        </>);
};
export default EnforcementProceedingChooses;
