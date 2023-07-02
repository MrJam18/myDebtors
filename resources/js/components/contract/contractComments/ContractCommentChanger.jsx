import React, {useEffect, useState} from 'react'
import api from "../../../http";
import {alertHandler} from "../../../utils/errorHandler";
import {useDispatch} from "react-redux";
import {recieveCessionInfo} from "../../../store/cessions/actions";
import actions from "../Actions";

const ContractCommentChanger = ({ setShow, commentId, update }) => {
    const dispatch = useDispatch();
    const {header, setHeader} = useState();

    useEffect( ()=> {
        dispatch(receiveCommentInfo(commentId))
            .then((header) => setHeader(header));
        return () => {
            dispatch(actions.setInfoDefault());
        }
    }, []);
    const receiveCommentInfo = (commentId) => async dispatch => {
        dispatch(actions.setInfoLoading(true));
        try{
            const {data} = await api.get('contracts/contract-comments/show/' + commentId);
            setHeader(data.comment);
            delete data.name;
            dispatch(actions.setInfoRows(data));
            return header;
        }
        catch (e) {
            alertHandler(e, 'Ошибка получения комментария!');
        }
        finally {
            dispatch(actions.setInfoLoading(false));
        }
    }
}

export default ContractCommentChanger
