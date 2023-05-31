import React from 'react';
import styles from '../../css/debtorInfo.module.css';
import {columns, passportColumns } from '../../constants/debtorColumns';
import deleteDebtorView from "./DeleteDebtor";
import Toolbar from "../dummyComponents/Toolbar";
import {Button} from "@mui/material";
import {makeStyles} from "@mui/styles";
import useModal from "../../hooks/useModal";
import AddPassport from "./AddPassport";
import BaseColumner from "../dummyComponents/Columns/BaseColumner";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {changeDebtor, changePassport} from "../../store/debtors/actions";
import {ChangeDebtorDispatcher} from "../../store/Dispatchers/Debtor/ChangeDebtorDispatcher";
// import { getPassport } from "../../store/debtors/selectors";


const useStyles = makeStyles({
    noPassportButton: {
        marginBottom: '10px',
        width: '50%',
        minWidth: '300px'
    }
})

const DebtorInfo = ({debtor, update}) => {
    const classes = useStyles();
    const {debtorId} = useParams();
    // const passport = useSelector(getPassport);
    const addPassport = useModal();
    const debtorReqFunction = async (column, value) => {
        const dispatcher = new ChangeDebtorDispatcher();
        dispatcher.addData(column, value);
        dispatcher.addNoReqData('debtorId', debtorId);
        dispatcher.addNoReqData('update', update);
        await dispatcher.handle();
    }
    const passportReqFunction = async (column, value) => {
        await debtorReqFunction('passport.' + column, value);
    }
    return (
        <div className={styles.content}>
            <div className={styles.header_small}>Информация о должнике</div>
            <Toolbar elements={[deleteDebtorView()]} />
            <div className={styles.info}>
               <BaseColumner columns={columns} data={debtor} reqFunction={debtorReqFunction} />
            </div>
            <div className={styles.header_small}>Паспортные данные</div>
            <div className={styles.info}>
                {
                    debtor?.passport !== 'noPassport' ? <BaseColumner columns={passportColumns} data={debtor?.passport} reqFunction={passportReqFunction} /> :
                    <>
                        <div className={styles.content__fullWidthWrapper + ' margin-bottom_20'}>
                            <div className={styles.content__link + ' ' + 'antibutton'}>У должника отсутствуют паспортные
                                данные!
                            </div>
                        </div>
                        <div className={styles.content__fullWidthWrapper}>
                            <Button variant={'contained'} className={classes.noPassportButton} onClick={addPassport.setShowTrue}> Заполнить паспортные
                                данные </Button>
                        </div>
                        { addPassport.show && <AddPassport setShow={addPassport.setShow} /> }
                    </>
                }
            </div>
        </div>
    );
};
export default DebtorInfo;