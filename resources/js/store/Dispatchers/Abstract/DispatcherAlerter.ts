import {Dispatch, SetStateAction} from "react";
import {Dispatcher} from "./Dispatcher";
import {setAlert} from "../../alert/actions"

export abstract class DispatcherAlerter extends Dispatcher
{
    protected _alertHeader: string = 'Ошибка';
    protected _errorMessage: string | null = null;

    constructor(setLoading: Dispatch<SetStateAction<boolean>>, formRef: HTMLFormElement | null = null, setShow: Dispatch<SetStateAction<boolean>> | null = null) {
        super(null, setLoading, formRef, setShow);
    }

    protected _handleError(e: Error) {
        this._dispatch(setAlert(this._alertHeader, this._errorMessage ?? e.message, 'error'));
    }

}