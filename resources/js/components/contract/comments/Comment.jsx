import React, { useRef } from "react";
import CustomInput from "../../dummyComponents/CustomInput";
import FileChooseHandler from "../../dummyComponents/FileChooseHandler";
import UploadButton from "../../dummyComponents/UploadButton";
const Comment = ({ file, setFile, initText = null }) => {
    var _a;
    const fileInputRef = useRef();
    const onDeleteFile = () => {
        setFile(null);
        fileInputRef.current.value = '';
    };
    return (<>
        <CustomInput defaultValue={initText} name={'text'} label={'Текст комментария'}/>
            <div className='flex_SB margin-top_10'>
                <div className="flex_vertical-center">
                Файл:
                <FileChooseHandler ref={fileInputRef} setFile={setFile} Button={UploadButton}/>
                {(_a = file === null || file === void 0 ? void 0 : file.name) !== null && _a !== void 0 ? _a : 'Отсутствует'}
                </div>
                <button type='button' onClick={onDeleteFile} className={'underline-button'}>Удалить файл</button>
            </div>
        </>);
};
export default Comment;
