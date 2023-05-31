import { setAlert } from "../store/alert/actions";
import { dispatch } from "../App";
/**
 * @param e{Error} error object
 * @param header{string} header for error;
 */
export const alertHandler = (e, header = 'Ошибка!') => {
    var _a;
    console.error(e);
    const message = ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data.message) || e.message;
    console.log(message);
    dispatch(setAlert(header, message, 'error'));
};
