import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getCurrentContract } from '../../store/contracts/actions';
import styles from '../../css/contract.module.css';
import { contractsSelectors } from '../../store/contracts/selectors';
import { chandeDateFormatOnRus } from '../../utils/changeDateFormat';
import Loading from '../dummyComponents/Loading';
import ContractMenu from './ContractMenu';
import ContractData from './contractData/ContractData';
import ContractPayments from './payments/ContractPayments'
import Actions from './Actions';
import { setAlert } from '../../store/alert/actions';
import Files from "./files/Files";
import {contractsSlice} from "../../store/contracts/reducer";
import Documents from "./documents/Documents";
import {useUpdate} from "../../hooks/useUpdate";
import CommentsList from "./comments/CommentsList";


const Contract = () => {
    const { contractId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const contract = useSelector(contractsSelectors.getCurrent) as Record<string, any>;
    const [menuValue, setMenuValue] = useState('data');
    const update = useUpdate();
    const menuSelector = () => {
        switch (menuValue) {
            case 'data':
                return <ContractData update={update.set} contractId={contractId}/>
            case 'payments':
                // @ts-ignore
                return <ContractPayments update={update.set} />
            case 'actions':
                return <Actions />
            case 'files':
                return  <Files />
            case 'documents':
                return <Documents update={update.set} />
            case 'comments':
                return <CommentsList />

        }
    }

    const getNecessary = async () => {
        setLoading(true);
        try{
            await dispatch(getCurrentContract(contractId));
        }
        catch(e){
            console.log(e.response.data);
            setError(e.response.data.message);
            setAlert('Ошибка!', "Ошибка при получении данных контракта!", 'error');
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        getNecessary();
        return () => {
            dispatch(contractsSlice.actions.reset());
        }
    }, [update.state]);
    return (
        <div className={'firstWindow'}>
            {loading &&  <div className="header">Загрузка</div> }
            {error && <div className="header">Ошибка!</div>}
            {(!loading && !error) && <div className="header">{`${contract.name} № ${contract.number} от ${chandeDateFormatOnRus(contract.date_issue)} г.`}</div> }
            <div className={"contentBox" + ' ' + styles.main}>
                <ContractMenu menuValue={menuValue} setMenuValue = {setMenuValue} />
                <div className={styles.menuDivider}></div>
                {/*<Divider itemScope orientation='vertical' />*/}
                {loading && <div className="center"><Loading/></div> }
                {error && <div className="center"><div className="header_small error">Ошибка получения контракта! <br />
                    {error}</div></div> }
                {(!loading && !error) && menuSelector() }
            </div>

        </div>
    );
};

export default Contract;
