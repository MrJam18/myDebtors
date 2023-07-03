import React, {useEffect, useRef, useState} from 'react';
import styles from '../../../css/contract.module.css';
import DocumentsGetter from "./DocumentsGetter";
import FileChooseHandler from "../../dummyComponents/FileChooseHandler";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import api from "../../../http";
import {getContractPath} from "../../../utils/getContractPath";
import {Alert} from "../../../classes/Alert";

const addButton = () => <FileUploadIcon sx={{color: 'black'}} className={styles.documents__uploadIcon + ' ' + styles.documents__icon} />
const DeleteButton = () => <DeleteForeverIcon color={'error'} className={styles.documents__deleteIcon + ' ' + styles.documents__icon} />

const FileHandler = ({header, fileName, existingFiles, globalLoading}) => {
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const formRef = useRef();
    const saveFile = async () => {
        setLoading(true);
        try {
            const formData = new FormData(formRef.current);
            formData.append('name', fileName);
            await api.post(getContractPath('files/save-file'), formData);
            setIsLoaded(true);
            Alert.set('Успешно', 'Файл успешно загружен');
        } catch (e) {
            Alert.setError('Ошибка при загрузке файла', e);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(()=> {
        setIsLoaded(Boolean(existingFiles[fileName]));
    }, [existingFiles])
    const deleteHandler = async () => {
        setLoading(true);
        try {
            if(!isLoaded) throw new Error('Файл не загружен');
            await api.delete(getContractPath('files/delete-file/' + fileName));
            setIsLoaded(false);
            Alert.set('Успешно', "Файл успешно удален");
        }
        catch (e) {
            Alert.setError('Ошибка при удалении файла', e);
        }
        finally {
            setLoading(false);
        }

    }
 return (
     <div className={styles.documents__fileHandler}>
       <div className={styles.documents__header}>{header}</div>
          <div className={styles.documents__files}>
               <DocumentsGetter loading={loading} isLoaded={isLoaded} globalLoading={globalLoading} documentName={fileName} />
                  <div className={styles.documents__uploadButtons}>
                      <form className={styles.files__form} ref={formRef}>
                        <FileChooseHandler onChangeFile={saveFile} extensions={['pdf']} action='add' title={'Загрузить'} Button={addButton}/>
                      </form>
                      <button title={'Удалить'} onClick={deleteHandler} className={styles.documents__deleteButton}><DeleteButton/></button>
                  </div>
          </div>
     </div>
 );
};

export default FileHandler;