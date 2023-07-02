import AuthService from "../../services/authService";
import usersSlice from "./reducer";
import api from "../../http";


const actions = usersSlice.actions


export const tryLogin = (data) => async (dispatch, getState) => {
    try {
        const result = await api.post('users/login', data);
        if(result.status === 302) throw new Error('Введены неверные учетные данные');
        if(result.data?.token) localStorage.setItem('token', result.data.token);
        else throw new Error('cant take token from server response');
        if(result.data.user) {
            dispatch(actions.login(result.data.user));
        }
        else throw new Error('cant take user from server response');
    }
    catch (e) {
        if(e.response?.status === 402) throw new Error(e.response.data.error);
        throw e;
    }

};

export const tryLogout = () => async dispatch => {
    try{
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchPending());
   const response = await AuthService.logout();
   if(response.status === 250) {
       localStorage.removeItem('token');
       dispatch(actions.logout());
       // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
       dispatch(actions.fetchSuccess());
   }
    else throw new Error('Не удается выйти из аккаунта');
    }
    catch(e){
        dispatch(actions.fetchError(e.message));
    }
    finally {
        dispatch(actions.setloading(false));
    }
}
export const getUser = () => async dispatch => {
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    dispatch(actions.fetchPending());
    try {
        const response = await api.get( 'users/get');
        if (response.data.user) dispatch(actions.login(response.data.user));
        else throw new Error('cant get user');
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        dispatch(actions.fetchSuccess());
    }
    catch(e){
        console.dir(e);
        dispatch(actions.fetchError(e.message));
    }
    finally {
        dispatch(actions.setloading(false));
    }
}
