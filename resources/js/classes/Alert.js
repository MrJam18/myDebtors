import { setAlert } from "../store/alert/actions";
import { dispatch } from "../App";
export class Alert {
    static set(header, text, type = 'success') {
        dispatch(setAlert(header, text, type));
    }
    static setError(header, error, prefix = null) {
        var _a;
        let message;
        // @ts-ignore
        const response = error.response;
        if ((response === null || response === void 0 ? void 0 : response.status) === 551 && ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.message)) {
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
