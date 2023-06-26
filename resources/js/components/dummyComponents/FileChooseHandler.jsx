import React, { useMemo, useRef } from 'react';
import { alertHandler } from "../../utils/errorHandler";
const FileChooseHandler = ({ extensions, setFile, Button, title = 'Загрузить', multiple = false, maxFileSize = 10485760, name = 'file' }) => {
    const inputRef = useRef();
    const accept = useMemo(() => {
        let acceptString = '';
        extensions.forEach((extension) => acceptString += extension + ',');
        return acceptString.substring(0, acceptString.length - 1);
    }, [extensions]);
    const onChange = async () => {
        try {
            const files = inputRef.current.files;
            const file = files[0];
            if (!file)
                return;
            if (file.size > maxFileSize)
                throw Error('Объем файла превышает ограничение в ' + maxFileSize + 'килобайт');
            let extensionMatch = false;
            extensions.find((extension) => {
                const regExp = new RegExp('.' + extension + '$');
                if (regExp.test(file.name)) {
                    extensionMatch = true;
                    return true;
                }
                return false;
            });
            if (!extensionMatch) {
                throw new Error('необходимо загрузить файл со следующими разрешениями: ' + accept + '.');
            }
            setFile(file);
        }
        catch (e) {
            alertHandler(e, 'Ошибка при загрузке файла.');
        }
    };
    return (<>
      {/*@ts-ignore*/}
      <button type='button' className={'antibutton'} title={title} style={{ padding: '0 2px' }} onClick={() => inputRef.current.click()}> <Button /> </button>
      <input onChange={onChange} multiple={multiple} ref={inputRef} accept={accept} style={{ display: 'none' }} type="file" id="file" name={name}/>
  </>);
};
export default FileChooseHandler;
