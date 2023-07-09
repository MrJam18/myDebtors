import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Alert} from "../../../classes/Alert";
import styles from "../../../css/contract.module.css";
import {useShow} from "../../../hooks/useShow";
import {saveFile} from "../../../http/index";
import {contractsSelectors} from "../../../store/contracts/selectors";
import {EasyDispatcher} from "../../../store/Dispatchers/EasyDispatcher";
import {getDefaultAgent} from "../../../utils/server/getDefaultAgent";
import AddAgent from "../../agents/AddAgent";
import EasySearch from "../../dummyComponents/search/EasySearch";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";
import CourtClaimChooser from "./choosers/CourtClaimChooser";

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
    const [courtClaim, setCourtClaim] = useState({
        name: contract.courtClaimName,
        id: contract.courtClaimId
    });
    const showCourtClaimChooser = useShow(CourtClaimChooser, {setCourtClaim});
    const [agent, setAgent] = useState(null);
    const showAddAgent = useShow(AddAgent, {setAgent});
    const onSubmit = (ev)=> {
        ev.preventDefault();
        if(!courtClaim.id) setError('Сначала создайте судебный иск');
        else {
            const dispatcher = new EasyDispatcher(setError,{setLoading});
            dispatcher.request = (serverAddress) => saveFile(serverAddress);
            dispatcher.handle(`documents/${selectedDoc.value}?agentId=${agent.id}&courtClaimId=${courtClaim.id}`, 'get');
        }
    }
    const onClickCourtClaim = () => {
        if(!courtClaim.id) Alert.set('Отсутствуют судебные иски', "Сначала создайте судебный иск.", 'error');
        else showCourtClaimChooser.setTrue();
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
                <div className={styles.executiveChooses__ExecutiveDocName} onClick={onClickCourtClaim}>{courtClaim.name}</div>
                <h4 className={styles.smallHeader}>
                    Представитель
                </h4>
                <SearchAndAddButton onClickAddButton={showAddAgent.setTrue} className={'margin-bottom_10 ' + styles.documents__selector} value={agent} setValue={setAgent} serverAddress={'agents/search-list'} required />
            </form>
            {showCourtClaimChooser.Comp()}
            {showAddAgent.Comp()}
        </>
        );
}

export default CourtClaimChooses;