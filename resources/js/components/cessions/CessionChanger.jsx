import React, {useEffect, useRef, useState} from 'react';
import EasyInput from "../dummyComponents/EasyInput";
import CustomCheckBox from "../dummyComponents/CustomCheckBox";
import {makeStyles} from "@mui/styles";
import {smallInput} from '../../constants/css';
import CustomChips from "../dummyComponents/customChips/CustomChips";
import {TextField} from "@mui/material";
import {getDefaultCessionText} from "../../utils/getDefaultCessionText";
import CustomFormStepper from "../dummyComponents/CustomFormStepper";
import {createUpdateElementsFunc} from "../../utils/createUpdateElementFunc";
import {useShow} from "../../hooks/useShow";
import NameChanger from "./NameChanger";
import CustomModal from "../dummyComponents/CustomModal";
import {useLoading} from "../../hooks/useLoading";
import api from "../../http";
import {Alert} from "../../classes/Alert";
import AddCreditor from "../creditors/AddCreditor";
import SearchAndAddButton from "../dummyComponents/search/SearchAndAddButton";
import Warning from "../dummyComponents/Warning";

const useStyles = makeStyles({
    smallInput
})

const CessionChanger = ({cessionGroupId = null, setShow, setCession = null, update}) => {
    const loading = useLoading(Boolean(cessionGroupId));
    const [deleteIds, setDeleteIds] = useState([]);
    const [dataArray, setDataArray] = useState([]);
    const [defaultCession, setDefaultCession] = useState(false);
    const showNameChanger = useShow(NameChanger, {
        dataArray,
        deleteIds,
        setShowCessionChanger: setShow,
        initDefaultCession: defaultCession,
        cessionGroupId,
        setCession,
        update
    });
    const [activeData, setActiveData] = useState({});
    const classes = useStyles();
    const textRef = useRef();
    const formRef = useRef();
    const [useDefaultText, setUseDefaultText] = useState(false);
    const [assignor, setAssignor] = useState(null);
    const [assignee, setAssignee] = useState(null);
    const [enclosures, setEnclosures] = useState([]);
    const showAddAssignor = useShow(AddCreditor, {setCreditor: setAssignor});
    const showAddAssignee = useShow(AddCreditor, {setCreditor: setAssignee});
    const onDeleteGroup = async ()=> {
        try {
            await api.delete('cessions/' + cessionGroupId);
            setShow(false);
            update();
            Alert.set('Успешно', "Цессия удалена");
        }
        catch (e) {
            Alert.setError('Ошибка при удалении цессии', e);
        }
    }
    const showDeleteWarning = useShow(Warning, {
        text: 'Вы действительно хотите удалить группу цессий?',
        onSubmit: onDeleteGroup
    });
    const onChangeDefaultCheckBox = () => {
        const form = formRef.current.elements;
        textRef.current.value = getDefaultCessionText(form.number.value, form.transferDate.value, assignee, assignor);
    }
    const getUpdatedData = (data) => {
        data.assignor = assignor;
        data.assignee = assignee;
        data.enclosures = enclosures;
        data.useDefaultText = useDefaultText;
        if(activeData.id) data.id = activeData.id;
        return data;
    }
    const updateData = (data) => {
        if(formRef.current && data) {
            const updateInput = createUpdateElementsFunc(data, formRef.current.elements);
            updateInput('transferDate');
            updateInput('number');
            updateInput('sum');
            updateInput('text');
            setAssignor(data.assignor);
            setAssignee(data.assignee);
            setEnclosures(data.enclosures ?? []);
            setUseDefaultText(data.useDefaultText);
        }
    }
    const onSubmit = (data) => {
        setDataArray(data);
        showNameChanger.setTrue();
    }
    useEffect(()=> {
        if(cessionGroupId) {
            api.get('cessions/get-one/' + cessionGroupId)
                .then(({data}) => {
                    if (data) {
                        setDataArray(data.list);
                        setDefaultCession(data.isDefaultCession);
                    }
                })
                .catch((e) => Alert.setError('Ошибка при получении списка цессий', e))
                .finally(() => loading.set(false));
        }
    }, [])
    return (
        <CustomModal setShow={setShow} customStyles={{width: '470px'}} >
            {showNameChanger.Comp()}
            {showAddAssignee.Comp()}
            {showAddAssignor.Comp()}
            {showDeleteWarning.Comp()}
            {loading.Comp(
                <CustomFormStepper onDeleteAll={cessionGroupId ? showDeleteWarning.setTrue : null} defaultData={{useDefaultText: false}} buttonText={'Продолжить'} ref={formRef} dataArray={dataArray} setDataArray={setDataArray} setActiveData={setActiveData} setDeleteIds={setDeleteIds} getUpdatedData={getUpdatedData} onChangeStep={updateData} onSubmit={onSubmit} loading={false} >
                <div className="margin-top_10"></div>
                <div className="small-inputs-box">
                    <EasyInput autoFocus label='дата цессии' className={classes.smallInput} type='date' name='transferDate' pattern='lessThenNow' required />
                    <EasyInput label='Номер цессии' className={classes.smallInput} name='number' />
                </div>
                <div className="full-width-box">
                    <SearchAndAddButton onClickAddButton={showAddAssignee.setTrue} label={'Цедент'} required value={assignor} serverAddress='creditors/search-list' getValue='short' setValue={setAssignor} />
                </div>
                <div className="full-width-box">
                    <SearchAndAddButton onClickAddButton={showAddAssignor.setTrue} label='Цессионарий' required value={assignee} serverAddress='creditors/search-list' getValue='short' setValue={setAssignee} />
                </div>
                <div className='full-width-box'>
                    <CustomChips header='Подтверждающие документы' list={enclosures} setList={setEnclosures} addHeader='Введите название документа' />
                </div>
                <div className="small-inputs-box">
                    <EasyInput label='Сумма цессии' className={classes.smallInput} pattern='float'  name='sum' />
                    <CustomCheckBox label='текст по умолчанию' className={classes.smallInput} onChange={onChangeDefaultCheckBox} checked={useDefaultText} setChecked={setUseDefaultText} />
                </div>
                <div className="full-width-box">
                    <TextField label={'Текст цессии'} required inputRef={textRef} multiline maxRows={10} fullWidth name='text' disabled={useDefaultText} />
                </div>
                {/*</form>*/}
            </CustomFormStepper>
            )}
        </CustomModal>
    );
};

export default CessionChanger;