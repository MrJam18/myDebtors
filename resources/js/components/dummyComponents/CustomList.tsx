import React, {useEffect} from "react";
import useList from "../../hooks/useList";
import {Order} from "../../Types/Order";
import NoBorderTable from "./NoBorderTable";
import Pagination from "./Pagination";

type Props = {
    headers: Array<{
        name: string,
        key: string
    }>,
    serverAddress: string,
    onClickRow?: (id: number) => void,
    update?: number,
    search?: string,
    setElement?: (el: Record<string, any>) => void,
    defaultOrder?: Order,
    defaultPerPage?: number
}
export default function CustomList({headers, defaultOrder=null,  serverAddress, onClickRow = null, update = null, search=null, setElement = null, defaultPerPage = 25 }: Props) {
    const list = useList(serverAddress, {perPage: defaultPerPage, order: defaultOrder}, search);
    useEffect(() => {
        if(update) list.update();
    }, [update]);
    const clickRowHandler = (index: number)=> {
        const currentEl = list.get[index];
        const id = currentEl.id ?? currentEl.idd;
        if(onClickRow) onClickRow(id);
        if(setElement) setElement({...currentEl});
    }
    return(
        <>
            <NoBorderTable headers={headers} rows={list.get} onClickRow={onClickRow||setElement ? clickRowHandler : null} focus={list.order[0]} sortHandler={list.setOrder}  loading={list.loading} />
            <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} total={list.totalItems} setPage={list.setPage} />
        </>
        )
}
