import {AxiosResponse} from "axios";
import {setAlert} from "../store/alert/actions";
import {dispatch} from "../App";

export class Alert {
    static set(header: string, text: string, type: string = 'success') {
        dispatch(setAlert(header, text, type));
    }
    static setError(header: string, error: AxiosResponse|Error, prefix: string | null = null)
    {
        let message;
        // @ts-ignore
        const response = error.response as AxiosResponse;
        if(response?.status === 551 && response?.data?.message) {
            message = response.data.message;
        }
        else { // @ts-ignore
            message = error.message;
        }
        console.dir(error);
        message = prefix ? prefix + message : message;
        dispatch(setAlert(header, message, 'error'));
    }
}