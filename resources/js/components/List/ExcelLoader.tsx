import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, {FormEvent, useState} from "react";
import {Alert} from "../../classes/Alert";
import {SelectType} from "../../classes/SelectType";
import styles from "../../css/list.module.css";
import {useForm} from "../../hooks/useForm";
import api, {saveFile} from "../../http/index";
import CustomModal from "../dummyComponents/CustomModal";
import EasySelect from "../dummyComponents/EasySelect";
import FileChooseHandler from "../dummyComponents/FileChooseHandler";

const loadTypes = [
    {id: 1, name: 'Выгрузка из базы данных'},
    {id: 2, name: 'Загрузка в базу данных'}
];
// @ts-ignore
const AddButton: React.ReactElement = () => <FileUploadIcon sx={{color: 'black', width: '25px', height: '25px'}} className={styles.documents__uploadIcon + ' ' + styles.documents__icon} />

const loadObjects = [
    new SelectType(1, 'должники', 'debtors'),
    new SelectType(2, "договора", 'contracts'),
    new SelectType(3, "исполнительные документы", 'executive-documents'),
    new SelectType(4, 'суды', 'courts'),
    new SelectType(5, 'Отделы судебных приставов', 'bailiff-departments')
];

const ExcelLoader = ({setShow, update}) => {
    const [loadType, setLoadType] = useState<number>();
    const [loadEntity, setLoadEntity] = useState<number>(null)
    const [file, setFile] = useState<File>(null);
    const form = useForm({setShow, buttonText: 'Загрузить', noDispatcher: true});
    const onLoadTemplate = async ()=> {
        const object = loadObjects.find((type: SelectType) => type.id === loadEntity);
        await saveFile(`excel/get-template?entityKey=${object.key}&entityName=${object.name}`);
    }
    const onSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        form.setError(null);
        form.setLoading(true);
        const object = loadObjects.find((type: SelectType) => type.id === loadEntity);
        try {
            if (loadType === 1) {
                await saveFile('excel/get-' + object.key);
                Alert.set('Успешно', "Выгрузка завершена");
            } else {
                if(!file) throw new Error('Сначала загрузите файл');
                const formData = new FormData(form.ref.current);
                await api.post(object.key + '/create-from-excel', formData);
                Alert.set('Успешно', "Загрузка успешно завершена");
                update();
            }
            setShow(false);
        } catch (e) {
            form.setError(e.message);
        }
        finally {
            form.setLoading(false);
        }

    }
    return (
        <CustomModal customStyles={{width: '400px'}} header={'Выгрузка Excel'} setShow={setShow}>
            <form onSubmit={onSubmit} ref={form.ref}>
            <EasySelect required value={loadType} customClassName={styles.fullWidthBlock} onChange={setLoadType} variants={loadTypes} label={'Тип выгрузки'} />
            <EasySelect required value={loadEntity} onChange={setLoadEntity} variants={loadObjects} name='entityId' customClassName={styles.fullWidthBlock} label={'Сущность для выгрузки'} />
            {loadType === 2 && loadEntity &&
            <div className="flex_SB">
                <div className={styles.fileBlock}>
                    Файл:
                    <FileChooseHandler name={'table'} extensions={['xlsx']} setFile={setFile} Button={AddButton}/>
                    {file ? file.name : 'Отсутствует'}
                </div>
                <button type='button' onClick={onLoadTemplate} className={'underline-button'}>Загрузить шаблон</button>
            </div>}
                {form.Button()}
            </form>
        </CustomModal>
        );
}

export default ExcelLoader