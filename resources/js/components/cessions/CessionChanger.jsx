import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {recieveCessionInfo, sendCessionChanges} from "../../store/cessions/actions";
import {cessionsSelector} from "../../store/cessions/selectors";
import {cessionsSlice} from "../../store/cessions/reducer";
import ChangerUI from "./UI/ChangerUI";

const actions = cessionsSlice.actions;

const CessionChanger = ({ setShow, cessionId, update }) => {
    const dispatch = useDispatch();
    const [header, setHeader] = useState(null);
    const info = useSelector(cessionsSelector.getInfo);
    const error = useSelector(cessionsSelector.selectInfoError);
    const activeCession = useSelector(cessionsSelector.selectActiveCession);
    const forceUpdate = useSelector(cessionsSelector.forceUpdate);
    useEffect( ()=> {
       dispatch(recieveCessionInfo(cessionId))
           .then((header) => setHeader(header));
       return () => {
            dispatch(actions.setInfoDefault());
        }
    }, []);
    const onSubmit = async (name, defaultCession) => {
        await dispatch(sendCessionChanges(name, defaultCession, cessionId));
        update();
        setShow(false);
    }
    return (
        <ChangerUI cessionGroupId={cessionId} update={update} activeCession={activeCession} info={info} error={error} onSubmit={onSubmit} showDeleteGroup setShow={setShow} cessionName={header} header={'Изменение группы цессий'} forceUpdate={forceUpdate} />
    );
};

export default CessionChanger;