import {useEffect, useState} from "react";
import {Alert} from "../../../../classes/Alert";
import styles from "../../../../css/documentsChooser.module.css";
import api from "../../../../http/index";
import {getContractPath} from "../../../../utils/getContractPath";
import CustomButton from "../../../dummyComponents/CustomButton";
import CustomModal from "../../../dummyComponents/CustomModal";
import CustomStepper from "../../../dummyComponents/CustomStepper";
import FullWidthData from "../../../dummyComponents/dataShow/FullWidthData";
import SmallData from "../../../dummyComponents/dataShow/SmallData";
import VerySmallData from "../../../dummyComponents/dataShow/VerySmallData";
import Loading from "../../../dummyComponents/Loading";

const ExecutiveDocChooser = ({setShow, setExecutiveDoc}) => {
    const [loading, setLoading] = useState(true);
    const [executiveDocsArray, setExecutiveDocsArray] = useState<Array<Record<string, any>>>([]);
    const [activeExecutiveDoc, setActiveExecutiveDoc] = useState<Record<string, any>>({});

    const onSave = () => {
        setExecutiveDoc({
            id: activeExecutiveDoc.id,
            name: activeExecutiveDoc.name,
        });
        setShow(false);
    }
    useEffect(() => {
        api.get(getContractPath('executive-documents/get-list-for-chooser'))
            .then(({data}) => {
                if (Array.isArray(data)) {
                    setExecutiveDocsArray(data);
                }
            })
            .catch((e) => Alert.setError('Ошибка пр получении исп. документов', e))
            .finally(()=>setLoading(false));
    }, []);
    return (
        <CustomModal setShow={setShow} >
            {loading ? <Loading/> :
                <div className={styles.main}>
                    <FullWidthData className='margin-bottom_10' header={'Суд, вынесший решение'} data={activeExecutiveDoc.court}/>
                    <FullWidthData className='margin-bottom_10' header={'Отдел судебных приставов'} data={activeExecutiveDoc.bailiffDepartment} />
                    <div className={styles.flexBetweenBlock + ' margin-bottom_10'}>
                        <SmallData header={"Дата исполнит. документа"} data={activeExecutiveDoc.issued_date} />
                        <SmallData header={'Номер исполнит. документа'} data={activeExecutiveDoc.number} />
                    </div>
                    <FullWidthData header={'Тип исполнительного документа'} data={activeExecutiveDoc.type} />
                    <h3 className='header' >Суммы подлежащие взысканию</h3>
                    <div className={styles.flexBetweenBlock + ' margin-bottom_10'}>
                        <VerySmallData header={'Сумма'} data={activeExecutiveDoc.sum} />
                        <VerySmallData header={"Осн. долг"} data={activeExecutiveDoc.main} />
                        <VerySmallData header={'Проценты'} data={activeExecutiveDoc.percents} />
                    </div>
                    <div className={styles.flexBetweenBlock + ' margin-bottom_10'}>
                        <SmallData header={"Неустойка"} data={activeExecutiveDoc.penalties} />
                        <SmallData header={'Госпошлина'} data={activeExecutiveDoc.fee} />
                    </div>
                    <div className={styles.flexBetweenBlock + ' margin-bottom_10'}>
                        <CustomStepper dataArray={executiveDocsArray} setActiveData={setActiveExecutiveDoc} />
                    </div>
                    <CustomButton onClick={onSave} text={'Выбрать'} />
                </div>
            }
        </CustomModal>
                );
}

export default ExecutiveDocChooser