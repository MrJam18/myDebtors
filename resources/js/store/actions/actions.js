import { serverApi } from '../../utils/serverApi';
import api, { saveFile } from '../../http';
import { actionsSlice } from './reducer';
const actions = actionsSlice.actions;
export const recieveActionsList = (contractId, page, limit, orderField, orderType) => async (dispatch) => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchPending());
    try {
        const { data } = await api.get(`actions/getList?contractId=${contractId}&page=${page}&limit=${limit}&orderField=${orderField}&orderType=${orderType}`);
        dispatch(actions.changeList({ list: data.rows, total: data.count }));
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        dispatch(actions.fetchSuccess());
    }
    catch (e) {
        dispatch(actions.fetchError(e.message));
    }
};
export const recieveAndSaveDocument = (path, name = 'document') => async () => {
    try {
        const result = await saveFile(serverApi + `documents/getDocument?path=${path}`, name);
        return result;
    }
    catch (e) {
        throw new Error(e.message);
    }
};
export const recieveLastActionsList = (page) => async (dispatch) => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchPending());
    const { data } = await api.get(`actions/lastActions?page=${page}&limit=${8}`);
    dispatch(actions.changeLastActionsList({ list: data.list, total: data.total }));
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchSuccess());
};
