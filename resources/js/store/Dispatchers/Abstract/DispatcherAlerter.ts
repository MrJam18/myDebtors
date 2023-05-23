import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {Alert} from "../../../classes/Alert";
import {Dispatcher} from "./Dispatcher";

export abstract class DispatcherAlerter extends Dispatcher
{
    protected _alertHeader: string = 'Ошибка';
    protected _errorMessage: string | null = null;

    constructor(setLoading: Dispatch<SetStateAction<boolean>> | null = null, formRef: MutableRefObject<HTMLFormElement> | null = null, setShow: Dispatch<SetStateAction<boolean>> | null = null) {
        super(null, setLoading, formRef, setShow);
    }

    protected _handleError(e: Error) {
        Alert.set(this._alertHeader, this._errorMessage ?? e.message, 'error')
    }

}