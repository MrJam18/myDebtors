import { useEffect, useState } from "react";
import { useParams } from "react-router";
import InnerMenu from "../dummyComponents/InnerMenu";
import Info from "./DebtorInfo";
import Loading from '../dummyComponents/Loading';
import styles from '../../css/debtor.module.css';
import api from "../../http/index";
import {Alert} from "../../classes/Alert";
import {useUpdate} from "../../hooks/useUpdate";


const menu = [{
    value: 'info',
    label: 'Информация',
    component: <Info />
},
{
    value: 'actions',
    label: 'Действия'
},
{
    value: 'comments',
    label: 'Комментарии'
}   
];

const Debtor = () => {
    const { debtorId } = useParams();
    const [loading, setLoading] = useState(true);
    const [debtor, setDebtor] = useState({});
    const update = useUpdate();
    const [menuValue, setMenuValue] = useState('info');
    const menuSelector = () => {
        switch (menuValue) {
            case 'info':
            return <Info debtor={debtor}/>
            default:
                return <Info debtor={debtor} />
        }
    }
    useEffect( ()=> {
            setLoading(true);
            api.get('debtors/get-one/' + debtorId)
                .then((response) => {
                    setDebtor(response.data);
                })
                .catch((reason) => Alert.setError('Данные не получены', reason))
                .finally(() => setLoading(false));
    }, [update.state]);
    return (
    <div className={'background firstWindow'}>
       <div className="header">{ loading ? 'Загрузка' : 'Должник ' + debtor.initials }</div>
    <div className={"contentBox" + ' ' + styles.main}>
    <InnerMenu menu={menu} menuValue={menuValue} setMenuValue = {setMenuValue} />
        {loading ? <div className="center"><Loading/></div> : <Info setLoading={setLoading} update={update.set} debtor={debtor} />    }
    </div>
    </div>
    );
};


export default Debtor;