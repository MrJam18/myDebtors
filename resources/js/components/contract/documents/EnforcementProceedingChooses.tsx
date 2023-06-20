import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Alert} from "../../../classes/Alert";
import styles from "../../../css/contract.module.css";
import {useDispatcher} from "../../../hooks/useDispatcher";
import {useShow} from "../../../hooks/useShow";
import api, {saveFile} from "../../../http/index";
import {contractsSelectors} from "../../../store/contracts/selectors";
import {getContractPath} from "../../../utils/getContractPath";
import {getDefaultAgent} from "../../../utils/server/getDefaultAgent";
import Loading from "../../dummyComponents/Loading";
import EasySearch from "../../dummyComponents/search/EasySearch";
import EnforcementProceedings from "../contractData/EnforcementProceedings";
import {SelectedDoc} from "./CourtClaimChooses";

type Props = {
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void,
    selectedDoc: SelectedDoc
}

const EnforcementProceedingChooses = ({selectedDoc, setError, setLoading}: Props) => {
    const contract = useSelector(contractsSelectors.getCurrent) as Record<string, any>;
    const [enforcementProceeding, setEnforcementProceeding] = useState<Record<string, any>>({
        name: 'Отсутствует'
    });
    const [currentLoading, setCurrentLoading] = useState(true);
    const [loadingUpdated, setLoadingUpdated] = useState(false);
    const [agent, setAgent] = useState(null);
    const dispatcher = useDispatcher(setError, {
        setLoading, request: (serverAddress) => saveFile(serverAddress),
    });
    const showEnforcementProceedings = useShow(EnforcementProceedings, {executiveDocId: contract.executiveDocId});

    const onSubmit = (ev) => {
        ev.preventDefault();
        if(!enforcementProceeding.id) setError('Сначала создайте исполнительное производство');
        else {
            dispatcher.handle(getContractPath(`documents/${selectedDoc.value}?enforcementProceedingId=${enforcementProceeding.id}&agentId=${agent.id}`), 'get');
        }
    }

    useEffect(() => {
        api.get(getContractPath('enforcement-proceedings/get-last-id-and-name'))
            .then(({data}) => {
                if(data) setEnforcementProceeding(data);
            })
            .catch(e => Alert.setError('Ошибка при получении исполнительного производства', e));
        getDefaultAgent(setAgent);
    },[]);
    useEffect(()=> {
        if(!loadingUpdated && enforcementProceeding && agent) {
            setLoadingUpdated(true);
            setCurrentLoading(false);
        }
    }, [enforcementProceeding, agent]);

    return (
        <>
            {showEnforcementProceedings.Comp()}
            {currentLoading ? <Loading/> :
                <form id='submitSelectDocument' className={styles.documents__executiveChoosesMain} onSubmit={onSubmit}>
                    <h4 className={styles.smallHeader}>
                        Исполнительное производство
                    </h4>
                    <div className={styles.executiveChooses__ExecutiveDocName}
                         onClick={showEnforcementProceedings.setTrue}>{enforcementProceeding.name}</div>
                    <h4 className={styles.smallHeader}>
                        Представитель
                    </h4>
                    <EasySearch className={'margin-bottom_10 ' + styles.documents__selector} value={agent}
                                setValue={setAgent} serverAddress={'agents/search-list'} required />
                </form>
            }
        </>
        );
}

export default EnforcementProceedingChooses