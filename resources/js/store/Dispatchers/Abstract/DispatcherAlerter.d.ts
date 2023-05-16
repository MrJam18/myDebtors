import { Dispatch, SetStateAction } from "react";
import { Dispatcher } from "./Dispatcher";
export declare abstract class DispatcherAlerter extends Dispatcher {
    protected _alertHeader: string;
    protected _errorMessage: string | null;
    constructor(setLoading: Dispatch<SetStateAction<boolean>>, formRef?: HTMLFormElement | null, setShow?: Dispatch<SetStateAction<boolean>> | null);
    protected _handleError(e: Error): void;
}
