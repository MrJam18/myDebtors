import styles from '../css/list.module.css';
import Debtors from './Debtors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import AddDebtor from './debtor/AddDebtor';
import {  useState } from 'react';
import Loading from './dummyComponents/Loading';
import Pagination from './dummyComponents/Pagination';
import AddContract from './contract/AddContract';
import useList from "../hooks/useList.js";

const List = () => {
    const list = useList('list/all', {perPage: 25});
    const [addDebtor, setAddDebtor] = useState(false);
    const [addContract, setAddContract] = useState(false);
    const openAddDebtor = () => {
        setAddDebtor(true);
    };
    const debtorsList = list.get.map(debtor => <Debtors debtor={debtor} key={debtor.id} setAddContract={setAddContract}/>);



    
    return (



    <div className='background firstWindow'>
       <div className={styles.list_treaties}>Список договоров</div>
          {addContract && <AddContract updateList={list.update} debtorId={addContract} setShow={setAddContract}/>}
         {addDebtor && <AddDebtor updateList={list.update} setAddDebtor={setAddDebtor}/>}
        <div className={"contentBox" + ' ' + styles.listBox}>
         <div className={styles.menuSort} icon={solid('user-plus')} >
          <div className={styles.utils}>
          <button className={styles.buttonUtil} title='добавить должника' onClick={openAddDebtor}>
          <FontAwesomeIcon icon={solid('user-plus')} className={styles.imgUtil}/>
          </button>
          <button className={styles.buttonUtil} onClick={()=>list.setOrder(['names.surname', 'ASC'])} title='сортировка по фамилии должника'>
          <FontAwesomeIcon icon={solid("arrow-down-a-z")} className={styles.imgUtil}/>
          </button>
          <button className={styles.buttonUtil} onClick={()=>list.setOrder(['names.surname', 'DESC'])} title='сортировка по фамилии должника'>
          <FontAwesomeIcon icon={solid("arrow-down-z-a")} className={styles.imgUtil}/>
          </button>
          <button className={styles.buttonUtil} title='сортировка по дате договора'>
          <FontAwesomeIcon icon={solid("sort-down")} className={styles.imgUtil}/>
          </button>
          <button className={styles.buttonUtil} title='сортировка по дате договора'>
          <FontAwesomeIcon icon={solid("sort-up")} className={styles.imgUtil}/>
          </button>
          <button className={styles.buttonUtil} title='настройка фильтра'>
          <FontAwesomeIcon icon={solid("filter")} className={styles.imgUtil}/>
          </button>
          </div>
          <div class='line' className={styles.line}></div>
          </div>
        <div>
          {list.loading ? <Loading /> : debtorsList}
         </div>
         <div class='line' className={styles.line}></div>
         <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} setPage={list.setPage} total={list.totalItems} />
        </div>
        </div>);
};
export default List;