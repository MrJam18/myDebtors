import React, {useState} from 'react';
import styles from '../../../css/contract.module.css';
import {getContractPath} from "../../../utils/getContractPath";
import Loading from "../../dummyComponents/Loading";
import {Button} from "@mui/material";
import api, {saveFile} from "../../../http";
import {useParams} from "react-router";
import {alertHandler} from "../../../utils/errorHandler";

type Props = {
    documentName: string,
    isLoaded: boolean,
    globalLoading: boolean,
    loading: boolean
}

const DocumentsGetter = ({ documentName, isLoaded, globalLoading, loading}) => {
    const loadHandler = async () => {
        try{
            await saveFile(getContractPath(`files/get-file?fileName=${documentName}`));
        }
        catch (e) {
            alertHandler(e, 'Ошибка получения файла')
        }
    }
    return (
        <div className={styles.documents__getter}>
            {loading || globalLoading ? <Loading addStyles={{margin: '0px 15px 0px 50px', minHeight: '30px', }} size={28}  bold={false} /> :
                isLoaded ? <Button size='small' onClick={loadHandler} variant='contained' >Загрузить файл</Button> : <div className={styles.documents__noDocuments}>Нет файлов для загрузки</div> }
        </div>
    );
};

export default DocumentsGetter;