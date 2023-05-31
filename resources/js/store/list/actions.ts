import api from "../../http";
import { listSlice } from './reducer';
import { setAlert } from "../alert/actions";


const actions = listSlice.actions;



export const receiveList = (limit= 25, page= 1, search= null) =>  async (dispatch) =>  {
    dispatch(actions.setListLoading(true));
    try {
    const {data} = await api.get(`debtors/list?limit=${limit}&page=${page}&search=${search}`);
    dispatch(actions.changeList({...data}));
    }
    catch(e) {
        setAlert('Ошибка подключения.', e.message, 'error');
    }
    finally{
        dispatch(actions.setListLoading(false));
    }

}
