import React, {useRef} from "react";
import CustomInput from "../../dummyComponents/CustomInput";
import FileChooseHandler from "../../dummyComponents/FileChooseHandler";
import UploadButton from "../../dummyComponents/UploadButton";

const Comment = ({file, setFile, initText = null}) => {
    const fileInputRef = useRef<HTMLInputElement>();
    const onDeleteFile = ()=> {
        setFile(null);
        fileInputRef.current.value = ''
    }
    return (
        <>
        <CustomInput defaultValue={initText} name={'text'} label={'Текст комментария'} />
            <div className='flex_SB margin-top_10'>
                <div className="flex_vertical-center">
                Файл:
                <FileChooseHandler ref={fileInputRef} setFile={setFile} Button={UploadButton}/>
                {file?.name ?? 'Отсутствует'}
                </div>
                <button type='button' onClick={onDeleteFile} className={'underline-button'}>Удалить файл</button>
            </div>
        </>
        );
}
export default Comment