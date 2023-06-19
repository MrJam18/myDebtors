import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from '../css/list.module.css';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import {useShow} from "../hooks/useShow";
import {Order} from "../Types/Order";
import AddDebtor from "./debtor/AddDebtor";

type Props = {
    setOrder: (order: Order) => void,
    update: ()=> void
}

const ListToolbar = ({setOrder, update}: Props) => {
    const showAddDebtor = useShow(AddDebtor, {updateList: update});
    return (
        <div className={styles.utils}>
            {showAddDebtor.Comp()}
            <FontAwesomeIcon icon={solid("fa-file-circle-plus")} />
            <button className={styles.buttonUtil} title='добавить должника' onClick={showAddDebtor.setTrue}>
                <FontAwesomeIcon icon={solid('user-plus')} className={styles.imgUtil}/>
            </button>
            <button className={styles.buttonUtil} onClick={()=>setOrder(['names.surname', 'ASC'])} title='сортировка по фамилии должника'>
                <FontAwesomeIcon icon={solid("arrow-down-a-z")} className={styles.imgUtil}/>
            </button>
            <button className={styles.buttonUtil} onClick={()=>setOrder(['names.surname', 'DESC'])} title='сортировка по фамилии должника'>
                <FontAwesomeIcon icon={solid("arrow-down-z-a")} className={styles.imgUtil}/>
            </button>
            <button className={styles.buttonUtil} title='сортировка по дате договора'>
                <FontAwesomeIcon icon={solid("sort-down")} onClick={()=> setOrder(['contracts.issued_date', 'ASC'])} className={styles.imgUtil}/>
            </button>
            <button className={styles.buttonUtil} title='сортировка по дате договора'>
                <FontAwesomeIcon icon={solid("sort-up")} onClick={()=> setOrder(['contracts.issued_date', 'DESC'])} className={styles.imgUtil}/>
            </button>
            <button className={styles.buttonUtil} title='настройка фильтра'>
                <FontAwesomeIcon icon={solid("filter")} className={styles.imgUtil}/>
            </button>
        </div>
        );
}

export default ListToolbar