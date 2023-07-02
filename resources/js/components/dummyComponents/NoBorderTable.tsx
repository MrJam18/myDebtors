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
    onClickRow?: (index: number) => void,
}
const NoBorderTable = ({rows = [], headers = [], sortHandler = null, focus = null, loading, onClickRow = null}: Props) => {
    const table = useRef();
    const [empty, setEmpty] = useState(false);
    const clickRowHandler = (ev) => {
        const index = ev.currentTarget.getAttribute('data-index');
        onClickRow(index);
    }
    useEffect(()=> {
        if(rows.length === 0 && !loading) {
            setEmpty(true);
        }
        else setEmpty(false);
    }, [rows, loading])
    return (
        <>
    <table className={styles.table} ref={table}>
        <thead>
            <tr className={styles.headers}>
                {headers.map((header, index) => (
                    <th style={header.styles ? header.styles : null} key={header.key} className={styles.header}>
                        {header.name}
                        <SortButton  sortHandler={sortHandler} header={header} focus={focus}/>
                    </th>))}
            </tr>
        </thead>
        { !loading && 
        <tbody>
        {
            rows.map((row, index) => {
            let array = [];
            headers.forEach((el) => {
                const cell = row[el.key] ?? null;
                array.push(
                    <td key={el.key + row.id} className={styles.row}>
                    <span className={styles.rowContainer}>
                        {cell}
                    </span>
                    </td>)
            });
            if(onClickRow){
                return (
                    <tr key={row.id} data-index={index} onClick={clickRowHandler} className={styles.clickableRow}>
                        {array}
                    </tr> )
            }
            return (
                <tr key={row.id} className={styles.rows}>
                    {array}
                </tr> )
        })}
        </tbody>
        } 
        </table>
        {empty && <div className={'center' + ' ' + styles.emptyText}>Нет ни одной записи</div>}
       {loading && <div className='center'> <Loading /> </div> }
       </>
    );
};

export default NoBorderTable;