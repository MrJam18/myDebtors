import { setAlert } from "../store/alert/actions";
import { dispatch } from "../App";
export class Alert {
    static set(header, text, type = 'success') {
        dispatch(setAlert(header, text, type));
    }
    static setError(header, error, prefix = null) {
        console.dir(error);
        const text = prefix ? prefix + error.message : error.message;
        dispatch(setAlert(header, text, 'error'));
    }
}
