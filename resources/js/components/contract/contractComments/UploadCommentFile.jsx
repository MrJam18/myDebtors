import React, {useEffect, useRef, useState} from 'react'
import api from "../../../http";
import {alertHandler} from "../../../utils/errorHandler";
import {useDispatch} from "react-redux";
import {recieveCessionInfo} from "../../../store/cessions/actions";
import actions from "../Actions";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    hidden: {
        opacity: '0',
        height: '0',
        width: '0',
        overflow: 'hidden',
        padding: '0',
        margin: '0'
    }
})


export const UploadCommentFile = (commentId) => {
    const filePicker = useRef(null);
    const [commentFile, setCommentFile] = useState('');
    const [uploaded, setUploaded] = useState(null);

    const handleChange = (event) => {
        setCommentFile(event.target.files[0]);
    }

    const handleUpload = async () => {
        if(!commentFile) {
            alertHandler('Выберите файл');
            return
        }
        try {
            console.log(commentId)
            const formData = new FormData();
            formData.append('file', commentFile);
            await api.post('contracts/contract-comments/upload/' + commentId.commentId, formData )
        } catch (e) {
            alertHandler(e, 'Ошибка загрузки файла!')
        }
    }

    const handlePick = () => {
        filePicker.current.click();
    }

    return (
        <>
            <button onClick={handlePick}>Добавить файл</button>
            <input
                className={useStyles().hidden}
                type='file'
                ref={filePicker}
                onChange={handleChange}
            />
            <button
                onClick={handleUpload}
            >
                загрузить
            </button>

            {commentFile && (
                <ul>
                    <li>Имя: {commentFile.name}</li>
                    <li>Тип: {commentFile.type}</li>
                    <li>Размер: {commentFile.size}</li>
                </ul>
            )}
        </>
    )
}

