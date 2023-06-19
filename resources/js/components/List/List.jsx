import styles from '../../css/list.module.css';
import Debtors from '../Debtors';
import AddDebtor from '../debtor/AddDebtor';
import {  useState } from 'react';
import Loading from '../dummyComponents/Loading';
import Pagination from '../dummyComponents/Pagination';
import AddContract from '../contract/AddContract';
import useList from "../../hooks/useList";
import {useLocation} from "react-router";
import ListToolbar from "./ListToolbar";

const List = () => {
    const location = useLocation();
    const list = useList('list/all', {perPage: 25}, location.state);
    const [addContract, setAddContract] = useState(false);
    const debtorsList = list.get.map(debtor => <Debtors debtor={debtor} key={debtor.id} setAddContract={setAddContract}/>);
    return (
    <div className='background firstWindow'>
          {addContract && <AddContract updateList={list.update} debtorId={addContract} setShow={setAddContract}/>}
        <div className={"contentBox" + ' ' + styles.listBox}>
        <ListToolbar setOrder={list.setOrder} update={list.update} />
        <div>
          {list.loading ? <Loading /> : debtorsList}
         </div>
         <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} setPage={list.setPage} total={list.totalItems} />
        </div>
        </div>);
};
export default List;