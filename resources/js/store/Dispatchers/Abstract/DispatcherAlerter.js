import { Alert } from "../../../classes/Alert";
import { Dispatcher } from "./Dispatcher";
export class DispatcherAlerter extends Dispatcher {
    constructor(setLoading = null, formRef = null, setShow = null) {
        super(null, setLoading, formRef, setShow);
        this._alertHeader = 'Ошибка';
        this._errorMessage = null;
    }
    _handleError(e) {
        var _a;
        Alert.set(this._alertHeader, (_a = this._errorMessage) !== null && _a !== void 0 ? _a : e.message, 'error');
    }
}
