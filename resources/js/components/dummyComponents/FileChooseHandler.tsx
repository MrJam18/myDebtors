import React, {useMemo, useRef} from 'react';
import {alertHandler} from "../../utils/errorHandler";

type Props = {
    extensions: string[],
    setFile: (file: File) => void,
    Button: React.ReactElement
    title?: string,
    multiple?:boolean,
    maxFileSize?: number,
    name?: string
}

const FileChooseHandler = ({extensions, setFile, Button, title = 'Загрузить', multiple = false, maxFileSize = 10485760, name = 'file'}: Props) => {
    const inputRef = useRef<HTMLInputElement>();
    const accept = useMemo(()=> {
        let acceptString = '';
        extensions.forEach((extension)=> acceptString += extension + ',');
        return acceptString.substring(0, acceptString.length - 1);
    }, [extensions])
    const onChange = async () => {
        try{
            const files = inputRef.current.files;
            const file = files[0] as File;
            if(!file) return;
            if(file.size > maxFileSize) throw Error('Объем файла превышает ограничение в ' + maxFileSize + 'килобайт');
            let extensionMatch = false;
             extensions.find((extension)=> {
                const regExp = new RegExp('.' + extension + '$');
                if(regExp.test(file.name)) {
                    extensionMatch = true;
                    return true;
                }
                return false;
            })
            if(!extensionMatch) {
                throw new Error('необходимо загрузить файл со следующими разрешениями: ' + accept + '.');
            }
            setFile(file);
        }
        catch (e) {
            alertHandler(e, 'Ошибка при загрузке файла.')
        }

    }
 return (
  <>
      {/*@ts-ignore*/}
      <button type='button' className={'antibutton'} title={title} style={{padding: '0 2px'}} onClick={()=> inputRef.current.click()} > <Button /> </button>
      <input onChange={onChange} multiple={multiple} ref={inputRef}  accept={accept} style={{display:'none'}} type="file" id="file" name={name} />
  </>
 );
};

export default FileChooseHandler;