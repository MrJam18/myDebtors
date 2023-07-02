import React, { useEffect } from "react";
import useList from "../../../hooks/useList";
import ContractCommentNoBorderTable from "./ContractCommentNoBorderTable";
import ContractCommentPagination from "./ContractCommentPagination";
export default function ContractCommentList({ headers, defaultOrder = null, serverAddress, onClickRow = null, update = null, search = null, setElement = null, commentId }) {
    const list = useList(serverAddress, { perPage: 25, order: defaultOrder }, search);
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
            <ContractCommentNoBorderTable headers={headers} rows={list.get} onClickRow={onClickRow ? clickRowHandler : null} focus={list.order[0]} sortHandler={list.setOrder} loading={list.loading} commentId={commentId}/>
            <ContractCommentPagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} total={list.totalItems} setPage={list.setPage}/>
        </>);
}
