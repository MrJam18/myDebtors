import React, { useEffect, useRef, useState } from 'react';
import styles from '../../css/noBorderTable.module.css'
import SortButton from './SortButton';
import Loading from './Loading';
import {Order} from "../../Types/Order";


type Props = {
    rows?: Array<Record<string, string> & {id: number}>,
    headers?: Array<{
        styles?: React.CSSProperties,
        name: string,
        key: string
    }>,
    sortHandler?: (order: Order)=> void,
    focus?: string,
    loading?: boolean,
    onClickRow?: (index: number) => void
}

const NoBorderTable = ({rows = [], headers = [], sortHandler = null, focus = null, loading, onClickRow = null}: Props) => {
    const table = useRef();
    let Rows = [];
    const [empty, setEmpty] = useState(false);
    const clickRowHandler = (ev) => {
        const index = ev.currentTarget.getAttribute('data-index');
        onClickRow(index);
    }
    const doRows = () => {
        if (!loading && rows.length !== 0) {
            Rows = rows.map((row, index) => {
                let array = []
                // const copyRow = {...row};
                const cellId = row.id;
                delete row.id;
                // delete copyRow.ref;
                headers.forEach((el) => {
                    let find = false;
                for (const key in row) {
                    if(key === el.key) {
                        find = true;
                        // let cellValue = row[key];
                    // if (el.type === 'date') cellValue = chandeDateFormatOnRus(cellValue) + ' г.';
                    array.push(<td className={styles.row}>
                        <span className={styles.rowContainer}>
                        {row[key]}</span>
                        </td>)
                        break;
                    }
                }
                if (!find) {
                    array.push(<td key={cellId} className={styles.row}>
                        <span className={styles.rowContainer}></span>
                        </td>)
                }
            })
            if(onClickRow){
                return ( 
                    <tr key={cellId} data-index={index} onClick={clickRowHandler} className={styles.clickableRow}>
                        {array}
                        </tr> )
            }
            return ( 
            <tr key={cellId} className={styles.rows}>
                {array}
                </tr> )
        });
    }
    }
    useEffect(()=> {
        if(rows.length === 0 && !loading) {
            setEmpty(true);
        }
        else setEmpty(false);
    }, [rows, loading])
    
    let Headers;
    const doHeaders = () => {
        Headers = headers.map((header, index) => <th style={header.styles ? header.styles : null} key={index} className={styles.header}>{header.name} <SortButton  sortHandler={sortHandler} header={header} focus={focus}/></th>)
    }
    doRows()
    doHeaders()
    return (
        <>
    <table className={styles.table} ref={table}>
        <thead>
            <tr className={styles.headers}>
                {Headers}
            </tr>
        </thead>
        { !loading && 
        <tbody>
            {Rows}
        </tbody>
        } 
        </table>
        {empty && <div className={'center' + ' ' + styles.emptyText}>Нет ни одной записи</div>}
       {loading && <div className='center'> <Loading /> </div> }
       </>
    );
};

export default NoBorderTable;