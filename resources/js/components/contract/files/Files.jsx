import React, {useEffect, useState} from 'react';
import styles from '../../../css/contract.module.css';
import FileHandler from "./FileHandler";
import api from "../../../http";
import {Alert} from "../../../classes/Alert";
import {getContractPath} from "../../../utils/getContractPath";


const fileList = [
    {name: 'contract', header: 'Договор и приложения'},
    {name: 'courtOrder', header: 'Судебный приказ'},
    {name: 'cancelDecision', header: 'Определение об отмене суд. приказа'},
    {name: 'executiveDocument', header: 'Исполнительный лист'},
    {name: 'IPInit', header: 'Постановление о возбуждении ИП'},
    {name: 'IPEnd', header: 'Постановление об окончании ИП'}
]


const Files = ({}) => {
    const [loading, setLoading] = useState(true);
    const [existingFiles, setExistingFiles] = useState({});
    useEffect(()=> {
        api.get(getContractPath('files/existing-files'))
            .then(({data}) => setExistingFiles(data))
            .catch((e) => Alert.setError('Ошибка при получении списка файлов', e))
            .finally(() => setLoading(false));
    }, []);
 return (
  <div className={styles.documents}>
      {
          fileList.map((file)=> {
             return (
                 <FileHandler key={file.name} fileName={file.name} header={file.header} globalLoading={loading} existingFiles={existingFiles} />
             )
          }

      )}
  </div>
 );
};

export default Files;