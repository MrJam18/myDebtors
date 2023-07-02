import {useEffect, useState} from "react";
import {Alert} from "../../../../classes/Alert";
import api from "../../../../http/index";
import {getContractPath} from "../../../../utils/getContractPath";
import CustomButton from "../../../dummyComponents/CustomButton";
import CustomModal from "../../../dummyComponents/CustomModal";
import CustomStepper from "../../../dummyComponents/CustomStepper";
import FullWidthData from "../../../dummyComponents/dataShow/FullWidthData";
import VerySmallData from "../../../dummyComponents/dataShow/VerySmallData";
import Loading from "../../../dummyComponents/Loading";
import styles from '../../../../css/documentsChooser.module.css'
import SmallData from "../../../dummyComponents/dataShow/SmallData";

const CourtClaimChooser = ({setShow, setCourtClaim}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [claimsArray, setClaimsArray] = useState<Array<Record<string, any>>>([]);
    const [activeClaim, setActiveClaim] = useState<Record<string, any>>({});
    useEffect(() => {
        api.get(getContractPath('court-claims/get-list-for-chooser'))
            .then(({data}) => {
                if (Array.isArray(data) && data.length !== 0) {
                    setClaimsArray(data);
                }
            })
            .catch((e) => Alert.setError('Ошибка при получении данных', e))
            .finally(() => setLoading(false));
    }, []);
    const onSave = () => {
        setCourtClaim({
            name: activeClaim.name,
            id: activeClaim.id
        });
        setShow(false);
    }
    return (
        <CustomModal setShow={setShow}>
            {loading ? <Loading/> :
                <div className={styles.main}>
                    <FullWidthData className='margin-bottom_10' header={'Тип судебного иска'} data={activeClaim.type}/>
                    <div className={styles.flexBetweenBlock + ' margin-bottom_10'}>
                        <VerySmallData header={"Дата расчета"} data={activeClaim.count_date} />
                        <VerySmallData header={'Статус'} data={activeClaim.status} />
                        <VerySmallData header={'Дата статуса'} data={activeClaim.status_date} />
                    </div>
                    <FullWidthData className='margin-bottom_10' header={'Суд'} data={activeClaim.court} />
                    <FullWidthData className='margin-bottom_10' header={'Представитель по делу'} data={activeClaim.agent} />
                    <h3 className='header' >Истребуемые суммы</h3>
                    <div className={styles.flexBetweenBlock + ' margin-bottom_10'}>
                        <VerySmallData header={'Сумма'} data={activeClaim.sum} />
                        <VerySmallData header={"Осн. долг"} data={activeClaim.main} />
                        <VerySmallData header={'Проценты'} data={activeClaim.percents} />
                    </div>
                    <div className={styles.flexBetweenBlock + ' margin-bottom_10'}>
                        <SmallData header={"Неустойка"} data={activeClaim.penalties} />
                        <SmallData header={'Госпошлина'} data={activeClaim.fee} />
                    </div>
                    <CustomStepper dataArray={claimsArray} setActiveData={setActiveClaim} />
                    <CustomButton onClick={onSave} text={'Выбрать'} />
                </div>
            }
        </CustomModal>
        );
}

export default CourtClaimChooser