import { ListItemButton } from "@mui/material";
import { useLocation } from "react-router";
import React, { useState } from "react";
import { Header } from "../../classes/Header";
import styles from '../../css/list.module.css';
import useList from "../../hooks/useList";
import Loading from "../dummyComponents/Loading";
import Pagination from "../dummyComponents/Pagination";
import SortButton from "../dummyComponents/SortButton";
import ContractListToolBar from "./ContractListToolBar";
import { Link } from "react-router-dom";
export const listHeaders = [
    new Header('Дата выдачи', 'contracts.issued_date', { className: styles.contracts__elementBlock, type: 'date' }),
    new Header('Номер', 'contracts.number', { className: styles.contracts__elementBlock_number }),
    new Header('должник', 'names.surname', { className: styles.contracts__elementBlock_big }),
    new Header('кредитор', 'creditors.short', { className: styles.contracts__elementBlock_big }),
    new Header('статус', 'contract_statuses.name', { className: styles.contracts__rightElementBlock })
];
const ContractList = () => {
    const location = useLocation();
    const [filter, setFilter] = useState(null);
    const list = useList('list/contracts', {
        perPage: 25,
        order: ['contracts.issued_date', 'DESC'],
        filter,
        method: 'post'
    }, location.state);
    return (<div className='background firstWindow'>
            <div className={"contentBox" + ' ' + styles.listBox}>
                <ContractListToolBar filter={filter} setFilter={setFilter} update={list.update}/>
                <div>
                    <div className={styles.headerBox}>
                        {listHeaders.map((header, index) => {
            return (<div className={header.className}>
                                <h5 className={styles.header}>{header.name}</h5>
                                <SortButton sortHandler={list.setOrder} header={header} focus={list.order[0]}/>
                            </div>);
        })}
                    </div>
                    {list.loading ? <Loading /> : list.get.map((contract) => (<Link to={`/contracts/${contract.id}`} key={contract.id} className='antiLink'>
                            <ListItemButton component='div' className='flex_SB'>
                                <div className={styles.contracts__elementBlock}>{contract.issued_date}</div>
                                <div className={styles.contracts__elementBlock_number}>{contract.number}</div>
                                <div className={styles.contracts__elementBlock_big}>{contract.debtor}</div>
                                <div className={styles.contracts__elementBlock_big}>{contract.creditor}</div>
                                <div className={styles.contracts__rightElementBlock}>{contract.status}</div>
                            </ListItemButton>
                        </Link>))}
                </div>
                <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} setPage={list.setPage} total={list.totalItems}/>
            </div>
        </div>);
};
export default ContractList;
