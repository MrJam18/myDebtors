import api from '../../http';
import { cessionsSlice } from "./reducer";
import { alertHandler } from "../../utils/errorHandler";
import { setAlert } from "../alert/actions";
import { getDefaultCessionText } from "../../utils/getDefaultCessionText";
import { prepareInfo } from "../../utils/prepareInfo";
const actions = cessionsSlice.actions;
export const findCessions = (val, setError) => async (dispatch) => {
    try {
        const { data } = await api.get('cessions/getNameList?value=' + val);
        dispatch(actions.setSearchList(data));
    }
    catch (e) {
        setError(e.message);
    }
};
export const recieveCessionsList = (page = 1, limit = 25, order = ['createdAt', 'DESC']) => async (dispatch) => {
    try {
        dispatch(actions.setLoading(true));
        const { data } = await api.get(`cessions/getList?page=${page}&limit=${limit}&order=${order}`);
        dispatch(actions.setList(data));
    }
    catch (e) {
        alertHandler(e, 'Ошибка получения списка!');
    }
    finally {
        dispatch(actions.setLoading(false));
    }
};
export const recieveCessionInfo = (cessionId) => async (dispatch) => {
    dispatch(actions.setInfoLoading(true));
    try {
        const { data } = await api.get('cessions/get-one/' + cessionId);
        const header = data.name;
        delete data.name;
        dispatch(actions.setInfoRows(data));
        return header;
    }
    catch (e) {
        alertHandler(e, 'Ошибка получения цессий!');
    }
    finally {
        dispatch(actions.setInfoLoading(false));
    }
};
export const setCessionChanges = (data, assignee, assignor, enclosures, useDefaultText, index, cessionId) => dispatch => {
    dispatch(actions.setInfoError(false));
    data.enclosures = enclosures;
    if (useDefaultText)
        data.text = getDefaultCessionText(data.number, data.transferDate, assignee, assignor);
    data.assignee = assignee;
    data.assignor = assignor;
    data.useDefaultText = useDefaultText;
    data.cessionId = cessionId;
    dispatch(actions.setInfoRow({ index, data }));
};
export const sendCessionChanges = (name, defaultCession, cessionId) => async (dispatch, getState) => {
    const state = getState();
    const info = prepareInfo(state.cessions.info.rows);
    const data = {
        cessions: info,
        name,
        deleteIds: state.cessions.info.deleteIds,
        defaultCession
    };
    await api.post('cessions/change-one/' + cessionId, data);
    dispatch(setAlert('Успешно', "Цессия успешно изменена."));
    dispatch(actions.setInfoShow(false));
};
export const deleteCessionInfoHandler = () => (dispatch, getState) => {
    const state = getState();
    const info = state.cessions.info;
    const activeCession = info.activeCession;
    if (info.count === 1)
        return dispatch(actions.setInfoError('В группе цессий должна быть как минимум одна цессия!'));
    const deleteId = info.rows[activeCession].id;
    if (deleteId) {
        dispatch(actions.pushDeleteId(deleteId));
    }
    dispatch(actions.deleteInfoRow(activeCession));
    dispatch(actions.forceUpdate());
};
export const deleteCessionGroup = (cessionId, setShow, update) => async (dispatch) => {
    try {
        await api.delete('cessions/delete-one/' + cessionId);
        setShow(false);
        update();
        dispatch(setAlert('Успешно', "Группа цессий успешно удалена."));
    }
    catch (e) {
        alertHandler(e);
        console.log(e);
    }
};
export const addCessionGroup = (name, defaultCession) => async (dispatch, getState) => {
    const state = getState();
    const data = {
        cessions: prepareInfo(state.cessions.info.rows),
        name,
        defaultCession
    };
    await api.post('cessions/create-one', data);
    dispatch(setAlert('Успешно', "Цессия успешно добавлена."));
};
