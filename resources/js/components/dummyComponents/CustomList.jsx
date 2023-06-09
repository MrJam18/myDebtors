import React, { useEffect } from "react";
import useList from "../../hooks/useList";
import NoBorderTable from "./NoBorderTable";
import Pagination from "./Pagination";
export default function CustomList({ headers, serverAddress, onClickRow = null, update = null, search = null, setElement = null }) {
    const list = useList(serverAddress, { perPage: 25 }, search);
    useEffect(() => {
        if (update)
            list.update();
    }, [update]);
    const clickRowHandler = (index) => {
        const currentEl = list.get[index];
        onClickRow(currentEl.idd);
        if (setElement)
            setElement(currentEl);
    };
    return (<>
            <NoBorderTable headers={headers} rows={list.get} onClickRow={onClickRow ? clickRowHandler : null} focus={list.order[0]} sortHandler={list.setOrder} loading={list.loading}/>
            <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} total={list.totalItems} setPage={list.setPage}/>
        </>);
}
