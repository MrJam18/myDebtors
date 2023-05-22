import api from '../../http';
import { organizationsSlice } from './reducer';
import {setAlert} from '../alert/actions'

const actions = organizationsSlice.actions;



export const recieveOrgList = (limit, page, order) => async dispatch => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchPending());
    try{
        const { data } = await api.get(`creditors/getList?limit=${limit}&page=${page}&order[]=${order[0]}&order[]=${order[1]}`);
        dispatch(actions.setList(data));
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        dispatch(actions.fetchSuccess());
    } catch(e) {
        dispatch(actions.fetchError(e.message));
    }
}

export const deleteOrganization = (id) => async dispatch => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchPending());
    try{
        await api.post('creditors/deleteOne', {id});
        await dispatch(recieveOrgList(25, 1, ['createdAt', 'ASC']));
        dispatch(setAlert('Успешно!', "Организация успешно удалена"));
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        dispatch(actions.fetchSuccess());
    }
    catch(e) {
        dispatch(actions.fetchError(e.message));
        throw new Error(e.message);
    }
}

export const changeDefaultCession = (creditorId, cession) => async dispatch => {
    await api.post('creditors/changeDefaultCession', {creditorId, cessionId: cession ? cession.id : null});
    dispatch(actions.setDefaultCessionForCreditor(cession));
    dispatch(setAlert('Успешно!', "Цессия по умолчанию изменена"));
}
