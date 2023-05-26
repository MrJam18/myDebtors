import React, {useEffect} from "react";
import useList from "../../hooks/useList";
import NoBorderTable from "./NoBorderTable";
import Pagination from "./Pagination";

type Props = {
    headers: Array<{
        name: string,
        key: string
    }>
    serverAddress: string,
    onClickRow?: (id: number) => void,
    update: number,
    search?: string
}
export default function CustomList({headers, serverAddress, onClickRow = null, update, search=null}: Props) {
    const list = useList(serverAddress, {perPage: 25}, search);
    useEffect(() => {
        if(update) list.update();
    }, [update]);
    const clickRowHandler = (index: number)=> {
        onClickRow(list.get[index].idd);
    }
    return(
        <>
            <NoBorderTable headers={headers} rows={list.get} onClickRow={onClickRow ? clickRowHandler : null} focus={list.order[0]} sortHandler={list.setOrder}  loading={list.loading} />
            <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} total={list.totalItems} setPage={list.setPage} />
        </>
        )
}