import { Dispatcher } from "./Dispatcher";
import { setAlert } from "../../alert/actions";
export class DispatcherAlerter extends Dispatcher {
    constructor(setLoading, formRef = null, setShow = null) {
        super(null, setLoading, formRef, setShow);
        this._alertHeader = 'Ошибка';
        this._errorMessage = null;
    }
    _handleError(e) {
        var _a;
        this._dispatch(setAlert(this._alertHeader, (_a = this._errorMessage) !== null && _a !== void 0 ? _a : e.message, 'error'));
    }
}
