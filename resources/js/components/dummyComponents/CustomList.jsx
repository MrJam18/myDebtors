import React from "react";
import useList from "../../hooks/useList";
import NoBorderTable from "./NoBorderTable";
import Pagination from "./Pagination";
export default function CustomList({ headers, serverAddress, onClickRow = null }) {
    const list = useList(serverAddress, { perPage: 25 });
    return (<>
            <NoBorderTable headers={headers} rows={list.get} onClickRow={onClickRow} focus={list.order[0]} sortHandler={list.setOrder} loading={list.loading}/>
            <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} total={list.totalItems} setPage={list.setPage}/>
        </>);
}
