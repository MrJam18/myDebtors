import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styles from "../../../css/contract.module.css";
import {useShow} from "../../../hooks/useShow";
import {saveFile} from "../../../http/index";
import {contractsSelectors} from "../../../store/contracts/selectors";
import {EasyDispatcher} from "../../../store/Dispatchers/EasyDispatcher";
import {getDefaultAgent} from "../../../utils/server/getDefaultAgent";
import EasySearch from "../../dummyComponents/search/EasySearch";
import CourtClaimChanger from "../contractData/CourtClaimChanger";

export type SelectedDoc = {
    value: string,
    label: string,
    id?: number
}
type Props = {
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void,
    update: ()=> void,
    selectedDoc: SelectedDoc
}

const CourtClaimChooses = ({setError, setLoading, update, selectedDoc}: Props) => {
    const contract = useSelector(contractsSelectors.getCurrent) as Record<string, any>;
    const showCourtClaimChanger = useShow(CourtClaimChanger, {courtClaimId: contract.courtClaimId, update});
    const [agent, setAgent] = useState(null);
    const onSubmit = (ev)=> {
        ev.preventDefault();
        if(!contract.courtClaimId) setError('Сначала создайте судебный иск');
        else {
            const dispatcher = new EasyDispatcher(setError,{setLoading});
            dispatcher.request = (serverAddress) => saveFile(serverAddress);
            dispatcher.handle(`documents/${selectedDoc.value}?agentId=${agent.id}&courtClaimId=${contract.courtClaimId}`, 'get');
        }
    }
    useEffect(()=> {
        getDefaultAgent(setAgent);
    }, []);
    return (
        <>
            <form id='submitSelectDocument' className={styles.documents__executiveChoosesMain} onSubmit={onSubmit} >
                <div className={styles.smallHeader}>
                    Cудебный иск
                </div>
                <div className={styles.executiveChooses__ExecutiveDocName} onClick={showCourtClaimChanger.setTrue}>{contract.courtClaimName}</div>
                <h4 className={styles.smallHeader}>
                    Представитель
                </h4>
                <EasySearch className={'margin-bottom_10 ' + styles.documents__selector} value={agent} setValue={setAgent} serverAddress={'agents/search-list'} required />
            </form>
            {showCourtClaimChanger.Comp()}
        </>
        );
}

export default CourtClaimChooses;