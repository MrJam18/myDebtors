import styles from '../../css/list.module.css';
import {useShow} from "../../hooks/useShow";
import {Order} from "../../Types/Order";
import AddDebtor from "../debtor/AddDebtor";
import ExcelLoader from "./ExcelLoader";
import ToolbarButton from "./ToolbarButton";

type Props = {
    setOrder: (order: Order) => void,
    update: ()=> void
}

const ListToolbar = ({setOrder, update}: Props) => {
    const showAddDebtor = useShow(AddDebtor, {updateList: update});
    const showExcelLoader = useShow(ExcelLoader, {update});
    return (
        <div className={styles.utils}>
            {showAddDebtor.Comp()}
            {showExcelLoader.Comp()}
            <ToolbarButton onClick={showExcelLoader.setTrue} iconName={'circlePlus'} title={'Выгрузка из Excel'} />
            <ToolbarButton onClick={showAddDebtor.setTrue} iconName={'userPlus'} title={'добавить должника'} />
            <ToolbarButton onClick={()=>setOrder(['names.surname', 'ASC'])} iconName={"arrowDown"} title={'сортировка по фамилии должника'} />
            <ToolbarButton onClick={()=>setOrder(['names.surname', 'DESC'])} iconName={"arrowUp"} title={'сортировка по фамилии должника'} />
            <ToolbarButton onClick={()=> setOrder(['contracts.issued_date', 'ASC'])} iconName={"sortDown"} title={'сортировка по дате договора'} />
            <ToolbarButton onClick={()=> setOrder(['contracts.issued_date', 'DESC'])} iconName={"sortUp"} title={'сортировка по дате договора'} />
            <ToolbarButton onClick={()=>null} iconName={"filter"} title={'настройка фильтра'} />
        </div>
        );
}

export default ListToolbar