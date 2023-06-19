import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, {useState} from "react";
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
    new SelectType(1, 'должники'),
    new SelectType(2, "договора"),
    new SelectType(3, "исполнительные документы"),
    new SelectType(4, "Исполнительные производства")
]

const ExcelLoader = ({setShow}) => {
    const [loadType, setLoadType] = useState<number>();
    const [loadEntity, setLoadEntity] = useState<number>(null)
    const [file, setFile] = useState<File>(null);
    const form = useForm({setShow, buttonText: 'Загрузить'});
    const onLoadTemplate = async ()=> {
        await saveFile(`excel/get-template?entityId=${loadEntity}`);
    }
    return (
        <CustomModal customStyles={{width: '400px'}} header={'Выгрузка Excel'} setShow={setShow}>
            <form ref={form.ref}>
            <EasySelect value={loadType} customClassName={styles.fullWidthBlock} onChange={setLoadType} variants={loadTypes} label={'Тип выгрузки'} />
            <EasySelect value={loadEntity} onChange={setLoadEntity} variants={loadObjects} name='entityId' customClassName={styles.fullWidthBlock} label={'Сущность для выгрузки'} />
            {loadType === 2 && loadEntity &&
            <div className="flex_SB">
                <div className={styles.fileBlock}>
                    Файл:
                    <FileChooseHandler extensions={['xlsx']} setFile={setFile} Button={AddButton}/>
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