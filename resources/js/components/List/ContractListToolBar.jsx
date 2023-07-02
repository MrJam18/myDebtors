import styles from '../../css/list.module.css';
import { useShow } from "../../hooks/useShow";
import AddContract from "../contract/AddContract";
import AddDebtor from "../debtor/AddDebtor";
import ExcelLoader from "./ExcelLoader";
import Filter from "./Filter";
import ToolbarButton from "./ToolbarButton";
const ContractListToolBar = ({ update, filter, setFilter }) => {
    const showAddContract = useShow(AddContract, { updateList: update });
    const showAddDebtor = useShow(AddDebtor, { updateList: update });
    const showExcelLoader = useShow(ExcelLoader, { update });
    const showFilter = useShow(Filter, { setFilter, filter });
    return (<div className={styles.utils}>
            {showFilter.Comp()}
            {showAddContract.Comp()}
            {showExcelLoader.Comp()}
            {showAddDebtor.Comp()}
            <ToolbarButton onClick={showExcelLoader.setTrue} iconName={'circlePlus'} title={'Выгрузка из Excel'}/>
            <ToolbarButton onClick={showAddContract.setTrue} iconName={'plus'} title={'Создать договор'}/>
            <ToolbarButton onClick={showAddDebtor.setTrue} iconName={'userPlus'} title={'Создать должника'}/>
            <ToolbarButton onClick={showFilter.setTrue} iconName={"filter"} title={'настройка фильтра'}/>
        </div>);
};
export default ContractListToolBar;
