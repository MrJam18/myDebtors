import {setAlert} from "../store/alert/actions";
import {dispatch} from "../App";

export class Alert {
    static set(header: string, text: string, type: string = 'success') {
        dispatch(setAlert(header, text, type));
    }
    static setError(header: string, error: Error, prefix: string | null = null)
    {
        console.dir(error);
        const text = prefix ? prefix + error.message : error.message;
        dispatch(setAlert(header, text, 'error'));
    }
}