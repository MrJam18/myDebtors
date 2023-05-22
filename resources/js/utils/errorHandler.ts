import {setAlert} from "../store/alert/actions";
import {dispatch} from "../App";



/**
 * @param e{Error} error object
 * @param header{string} header for error;
 */
export const alertHandler = (e, header = 'Ошибка!') => {
    console.error(e);
    const message = e.response?.data.message || e.message;
    console.log(message);
    dispatch(setAlert(header, message, 'error'));
}
