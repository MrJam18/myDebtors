import React, { useEffect } from "react";
import useList from "../../hooks/useList";
import NoBorderTable from "./NoBorderTable";
import Pagination from "./Pagination";
export default function CustomList({ headers, defaultOrder = null, serverAddress, onClickRow = null, update = null, search = null, setElement = null, defaultPerPage = 25 }) {
    const list = useList(serverAddress, { perPage: defaultPerPage, order: defaultOrder }, search);
    useEffect(() => {
        if (update)
            list.update();
    }, [update]);
    const clickRowHandler = (index) => {
        var _a;
        const currentEl = list.get[index];
        const id = (_a = currentEl.id) !== null && _a !== void 0 ? _a : currentEl.idd;
        if (onClickRow)
            onClickRow(id);
        if (setElement)
            setElement(Object.assign({}, currentEl));
    };
    return (<>
            <NoBorderTable headers={headers} rows={list.get} onClickRow={onClickRow || setElement ? clickRowHandler : null} focus={list.order} sortHandler={list.setOrder} loading={list.loading}/>
            <Pagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} total={list.totalItems} setPage={list.setPage}/>
        </>);
}
