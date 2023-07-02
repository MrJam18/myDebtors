import React, {useEffect} from "react";
import useList from "../../../hooks/useList";
import {Order} from "../../../Types/Order";
import ContractCommentNoBorderTable from "./ContractCommentNoBorderTable";
import ContractCommentPagination from "./ContractCommentPagination";

type Props = {
    headers: Array<{
        name: string,
        key: string
    }>
    serverAddress: string,
    onClickRow?: (id: number) => void,
    update?: number,
    search?: string,
    setElement?: (el: Record<string, any>) => void,
    defaultOrder?: Order
    commentId?: number
}
export default function ContractCommentList({headers, defaultOrder=null,  serverAddress, onClickRow = null, update = null, search=null, setElement = null, commentId}: Props) {
    const list = useList(serverAddress, {perPage: 25, order: defaultOrder}, search);
    useEffect(() => {
        if(update) list.update();
    }, [update]);
    const clickRowHandler = (index: number)=> {
        const currentEl = list.get[index];
        onClickRow(currentEl.idd);
        if(setElement) setElement(currentEl);
    }
    return(
        <>
            <ContractCommentNoBorderTable headers={headers} rows={list.get} onClickRow={onClickRow ? clickRowHandler : null} focus={list.order[0]} sortHandler={list.setOrder}  loading={list.loading} commentId={commentId} />
            <ContractCommentPagination page={list.page} perPage={list.perPage} setPerPage={list.setPerPage} total={list.totalItems} setPage={list.setPage}/>
        </>
    )
}
