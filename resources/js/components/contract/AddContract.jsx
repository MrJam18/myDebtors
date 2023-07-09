import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from "../../css/addContract.module.css";
import { InputLabel, MenuItem, Select } from "@mui/material";
import EasyInput from "../dummyComponents/EasyInput";
import { useError } from "../../hooks/useError";
import { makeStyles } from "@mui/styles";
import { cessionsSlice } from "../../store/cessions/reducer";
import { organizationsSlice } from "../../store/creditors/reducer";
import ButtonInForm from "../dummyComponents/ButtonInForm";
import CustomModal from "../dummyComponents/CustomModal";
import { AddContractDispatcher } from "../../store/Dispatchers/Contracts/AddContractDispatcher";
import ServerSelect from "../dummyComponents/ServerSelect";
import useInput from "../../hooks/useInput";
import {useShow} from "../../hooks/useShow";
import AddDebtor from "../debtor/AddDebtor";
import AddCreditor from "../creditors/AddCreditor";
import SearchAndAddButton from "../dummyComponents/search/SearchAndAddButton";
import CessionChanger from "../cessions/CessionChanger";
const cessionsActions = cessionsSlice.actions;
const defaultCession = { name: 'Принадлежит выдавшей организации', id: null };
export const useStyles = makeStyles({
    input: {
        marginBottom: '10px',
        width: '45%'
    },
    checkbox: {
        width: '160px',
        lineHeight: 1.2,
        marginLeft: '55px'
    },
    smallInput: {
        width: '225px',
    },
    button: {
        width: '50%',
        height: '35px',
    },
    selectLabel: {
        alignSelf: 'baseline',
        fontSize: '12px',
        lineHeight: '16.2px'
    },
    fullWidthLabel: {
        color: 'black',
        lineHeight: '16.2px',
        marginBottom: '5px'
    },
    input_small: {
        width: '150px',
        marginBottom: '10px'
    },
    button_small: {
        width: '100%'
    }
});
const AddContract = ({ debtorId, setShow, updateList }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const formRef = useRef();
    const error = useError();
    const [loading, setLoading] = useState(false);
    const [cession, setCession] = useState(defaultCession);
    const [creditor, setCreditor] = useState(null);
    const [statusId, setStatusId] = useState(1);
    const [debtor, setDebtor] = useState(null);
    const typeInput = useInput('1');
    const showAddDebtor = useShow(AddDebtor, {setDebtor});
    const showAddCreditor = useShow(AddCreditor, {setCreditor});
    const showAddCession = useShow(CessionChanger, {setCession});
    const startHandler = () => {
        error.noError();
        dispatch(organizationsSlice.actions.setSearchList([]));
        dispatch(cessionsActions.setSearchList([]));
    };
    const formHandler = async (ev) => {
        ev.preventDefault();
        const controller = new AddContractDispatcher(error.setError, setLoading, formRef, setShow);
        const data = controller.data;
        data.cessionId = cession.id;
        data.creditorId = creditor?.id;
        data.statusId = statusId;
        data.debtorId = debtorId ?? debtor.id;
        await controller.handle();
        updateList();
    };
    useEffect(startHandler, []);
    const onChangeCreditor = (creditor) => {
        setCreditor(creditor);
        if (creditor?.default_cession) {
            setCession(creditor.default_cession);
        }
        else
            setCession(defaultCession);
    }
    return (
    <CustomModal customStyles={{ width: '500px' }} header={"Создание договора"} setShow={setShow} show>
        {showAddDebtor.Comp()}
        {showAddCession.Comp()}
        {showAddCreditor.Comp()}
         <form ref={formRef} onSubmit={formHandler}>
             <div>
                 <div className={styles.header + ' ' + 'marginTop_0'}>Данные о договоре</div>
                 <div className={styles.contractData}>
                     <div className={styles.selectBlock + ' ' + classes.input}>
                         <InputLabel id="contractType" required className={classes.selectLabel}>тип договора</InputLabel>
                         <Select {...typeInput} fullWidth variant='standard' labelId="contractType" name='typeId'>
                             <MenuItem value='1'>договор займа</MenuItem>
                             <MenuItem value='2'>кредитный договор</MenuItem>
                         </Select>
                     </div>
                     <ServerSelect smallLabel defaultId={1} serverAddress={'contracts/status-list'} setId={setStatusId} label='Статус' customClassName={classes.input} />
                     <EasyInput label='Номер договора' name='number' required className={classes.input}/>
                     <EasyInput label='Дата выдачи' type='date' pattern='lessThenNow' name='issued_date' required className={classes.input}/>
                     <EasyInput label='сумма выдачи' name='issued_sum' pattern='float' required className={classes.input}/>
                     <EasyInput label='дата исполнения' type='date' name='due_date' pattern='lessThenNow' required className={classes.input}/>
                     <EasyInput label='проц. ставка (% год.)' name='percent' pattern='float' required className={classes.input}/>
                     <EasyInput label='неустойка (% год.)' name='penalty' pattern='float' required className={classes.input}/>
                     {typeInput.value === '2' &&
                         <>
                             <EasyInput label={'Сумма ежемес. платежа'} name='month_due_sum' required pattern={'float'} className={classes.input} />
                             <EasyInput label='Дата ежемес. платежа' name='month_due_date' required className={classes.input} />
                        </>
                     }
                 </div>
                 { !debtorId &&
                     <div className={styles.selectMargin}>
                         <SearchAndAddButton label='Должник по договору' value={debtor} getValue='default_cession' required serverAddress={'debtors/search-list'} setValue={setDebtor} onClickAddButton={showAddDebtor.setTrue} />
                     </div>
                 }
                 <div className={styles.selectMargin}>
                     <SearchAndAddButton label='кредитор, которому принадлежит заем' value={creditor} getValue='default_cession' required serverAddress={'creditors/search-list-with-cession'} setValue={onChangeCreditor} onClickAddButton={showAddCreditor.setTrue} />
                 </div>
                 <div className={styles.selectMargin}>
                     <SearchAndAddButton onClickAddButton={showAddCession.setTrue} reqData={creditor ? {creditorId: creditor.id} : null} label='договор цессии, по которому приобретен займ' value={cession} required serverAddress={'cessions/search-list'} setValue={setCession}/>
                 </div>
             </div>
             <ButtonInForm loading={loading}/>
             {error.Comp()}
         </form>
     </CustomModal>);
};
export default AddContract;
//# sourceMappingURL=AddContract.jsx.map