import { setAlert } from "../alert/actions";
import api from "../../http";
import { contractsSlice } from "./reducer";
import { alertHandler } from "../../utils/errorHandler";
const actions = contractsSlice.actions;
export const getCurrentContract = (id) => async (dispatch) => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchPending());
    const { data } = await api.get('contracts/get-contract/' + id);
    dispatch(actions.setCurrentContract(data.contract));
    if (data.contract.executiveDoc) {
        dispatch(actions.setExecutiveDoc(data.contract.executiveDoc));
    }
    if (data.contract.court) {
        dispatch(actions.setCourt(data.contract.court));
    }
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchSuccess());
};
export const changeContract = (column, value, contractId) => async (dispatch) => {
    try {
        await api.post('contracts/change-contract', { column, value, contractId });
        dispatch(setAlert('Успешно', 'Контракт успешно изменен'));
        await dispatch(getCurrentContract(contractId));
    }
    catch (e) {
        let message = e.mesage;
        if (e.response.status === 551)
            message = e.response.data.message;
        throw new Error(message);
    }
};
export const createIPInitDoc = (contractId, agentId) => async (dispatch, getState) => {
    // if(!getState().contracts.executiveDoc.id) throw new Error('Укажите данные исполнительного документа!');
    // await saveFilePost('documents/createIPInit', {contractId, agentId}, `ЗВИП по договору ${contractId}.docx`);
    // dispatch(setAlert('Успешно', "Заявление успешно создано."));
    throw new Error('no implemented');
};
export const deleteContract = id => async (dispatch) => {
    await api.post('contracts/deleteOne', { id });
    dispatch(setAlert('Успешно', "Договор успешно удален"));
};
export const getExistingFiles = (contractId) => async (dispatch) => {
    try {
        dispatch(actions.setLoadingExisting(true));
        const { data } = await api.get(`contracts/${contractId}/files/get-existing`);
        dispatch(actions.setExistingFiles(data));
    }
    catch (e) {
        alertHandler(e, 'ошибка получения файлов');
    }
    finally {
        dispatch(actions.setLoadingExisting(false));
    }
};
export const deleteContractFile = (contractId, fileName) => async (dispatch) => {
    try {
        dispatch(actions.setCurrentLoadingExisting({ fileName, status: true }));
        await api.post('files/deleteContractFile', { contractId, fileName });
        dispatch(actions.setCurrentExisting({ fileName, status: false }));
        dispatch(setAlert('Успешно', "Файл успешно удалён"));
    }
    catch (e) {
        alertHandler(e, 'Ошибка удаления файла');
    }
    finally {
        dispatch(actions.setCurrentLoadingExisting({ fileName, status: false }));
    }
};
