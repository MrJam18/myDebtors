import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {useUpdate} from "../../../hooks/useUpdate";
import CustomModal from "../../dummyComponents/CustomModal";
import api from "../../../http";
import {alertHandler} from "../../../utils/errorHandler";
import {TextField} from "@mui/material";
import {UploadCommentFile} from './UploadCommentFile'
import ContractCommentList from "./ContractCommentsList";



function ContractComment() {
    const headers = [
        {name: "Дата добавления", key: 'created_at', type: 'date'},
        {name: "Комментарий", key: 'text'},
        {name: "Автор", key: 'author'},
        {name: 'Файл', key: 'comment_file'},];
    const {contractId} = useParams();
    const update = useUpdate();
    const [commentId, setCommentId] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showAddTextModal, setShowAddTextModal] = useState(false)
    const [comment, setComment] = useState('')


    useEffect(() => {
        getCommentText(commentId)

    }, [commentId])

    const onClickRow = (id) => {
        setShowModal(true)
        setCommentId(id);
    }

    const onChange = (event) => {
        setComment(event.target.value)
    }

    const createComment = async (id, commentText) => {
        try {
            await api.post(`contracts/${contractId}/contract-comments/create`, {id, commentText});
            setShowAddTextModal(false)
            update.set()
        } catch (e) {
            alertHandler(e, 'Ошибка добавления комментария!');
        }
    }

    const getCommentText = async (id) => {
        try {
            const {data} = await api.get('contracts/contract-comments/show/' + id);
            setComment(data.text);
        } catch (e) {
            alertHandler(e, 'Ошибка получения комментария!');
        }
    }
    const changeCommentText = async (column, value, id) => {
        try {
            await api.post('contracts/contract-comments/update/' + id, {column, value, id});
            setShowModal(false)
            update.set()
        } catch (e) {
            alertHandler(e, 'Ошибка изменения комментария!');
        }
    }

    const deleteComment = async (id) => {
        try {
            await api.post('contracts/contract-comments/delete/' + id, {id});
            setShowModal(false)
            update.set()
        } catch (e) {
            alertHandler(e, 'Ошибка удаления комментария!')
        }
    }

    return (
        <div>
            <ContractCommentList
                headers={headers}
                serverAddress={`contracts/${contractId}/contract-comments/index`}
                onClickRow={onClickRow}
                update={update.state}
            />
            <button
                type={"button"}
                onClick={() => setShowAddTextModal(true)}>
                добавить комментарий
            </button>
            <CustomModal
                customClassName={'changeComment'}
                header='Редактировать комментарий'
                customStyles={{width: 500}}
                show = {showModal}
                setShow={setShowModal}>
                    <TextField
                        value={comment}
                        onChange={onChange}
                        />
                    <UploadCommentFile commentId={commentId} update={update} setShow={setShowModal}/>
                    <button
                        type={"submit"}
                        onClick={() => changeCommentText('comments', comment, commentId)}>
                        сохранить
                    </button>
                    <button
                        type={'submit'}
                        onClick={() => deleteComment(commentId)}>
                        удалить комментарий
                    </button>
            </CustomModal>

            <CustomModal
                customClassName={'addComment'}
                header='Добавить комментарий'
                customStyles={{width: 500}}
                show = {showAddTextModal}
                setShow={setShowAddTextModal}>
                <TextField
                    onChange={onChange}
                    />
                <button
                    type={"submit"}
                    onClick={() => createComment(contractId, comment)}>
                    сохранить
                </button>
            </CustomModal>

        </div>
    )
}

export default ContractComment;
