import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from "axios";
import ButtonInForm from "../../dummyComponents/ButtonInForm";
import CustomButton from "../../dummyComponents/CustomButton";
import CustomList from "../../dummyComponents/CustomList";
import useList from "../../../hooks/useList";
import {useParams} from "react-router";
import ToolbarAddButton from "../../dummyComponents/ToolbarAddButton";
import AddButton from "../../cessions/AddButton";
import {useShow} from "../../../hooks/useShow";
import ContractCommentChanger from "./ContractCommentChanger";
import {useUpdate} from "../../../hooks/useUpdate";
import CustomModal from "../../dummyComponents/CustomModal";
import EasyInput from "../../dummyComponents/EasyInput";
import api from "../../../http";
import actions from "../Actions";
import {useDispatch} from "react-redux";
import {alertHandler} from "../../../utils/errorHandler";
import CustomInput from "../../dummyComponents/CustomInput";
import {TextField} from "@mui/material";
import {values} from "../../../../../public/dist/js/app";


function contractComment() {
    const dispatch = useDispatch();
    const headers = [
        {name: "Дата добавления", key: 'created_at', type: 'date'},
        {name: "Комментарий", key: 'text'},
        {name: "Автор", key: 'author'},
        {name: 'Файл', key: 'comment_file'}];
    const {contractId} = useParams();
    const update = useUpdate();
    const [commentId, setCommentId] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [comment, setComment] = useState(null)
    const {header, setHeader} = useState();
    // const list = useList(`contracts/${contractId}/contract-comments/show/${commentId}`)
    // const showComments = useShow(ContractCommentChanger, {commentId, update: update.set});

    // const [commentFile, setCommentFile] = useState('')
    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState(false)

    // useEffect( ()=> {
    //     dispatch(getCommentText(commentId))
    //         .then((header) => setHeader(header));
    //     return () => {
    //         dispatch(getCommentText().setInfoDefault());
    //     }
    // }, []);

    const onClickRow = (id) => {
        setShowModal(true)
        setCommentId(id);
        getCommentText(id)
    }

    const onChange = (event) => {
        setComment(event.target.value)
    }


    const getCommentText = async (commentId) => {
        try {
            const {data} = await api.get('contracts/contract-comments/show/' + commentId);
            setComment(data.text);
            return header;
        } catch (e) {
            alertHandler(e, 'Ошибка получения комментария!');
        }
    }

    return (
        <div>
            <CustomList
                headers={headers}
                serverAddress={`contracts/${contractId}/contract-comments/index`}
                onClickRow={onClickRow}
                update={update.state}
                setElement={getCommentText}/>
                <CustomModal
                    header='Редактировать комментарий'
                    customStyles={{width: 500}}
                    show = {showModal}
                    setShow={setShowModal}>
                    <TextField value={comment} onChange={onChange}/>

                </CustomModal>
        </div>
    )
}


export default contractComment;
