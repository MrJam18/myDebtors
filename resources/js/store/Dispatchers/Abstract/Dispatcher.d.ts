import { Dispatch, SetStateAction } from "react";
import { store } from "../../../App.jsx";
import { CaseReducerActions, SliceCaseReducers } from "@reduxjs/toolkit";
export declare type DispatcherData = {
    [key: string]: any;
    formData: Record<string, any> | null;
};
export declare abstract class Dispatcher {
    #private;
    protected readonly _setError: Function | null;
    data: DispatcherData;
    protected readonly _dispatch: typeof store.dispatch;
    protected readonly _getState: typeof store.getState;
    protected readonly _api: import("axios").AxiosInstance;
    protected _actions: CaseReducerActions<SliceCaseReducers<unknown>, string> | null;
    abstract _handler(dispatcherData: DispatcherData): Promise<any>;
    /**
     *
     * @param {function} setError function which change error state
     * @param {function} setLoading function which change loading state
     * @param {function} setShow function which change show state for close modalWindow
     * @param {object} formRef formRef what inserted to data properties
     */
    constructor(setError: Function | null, setLoading: Dispatch<SetStateAction<boolean>>, formRef?: HTMLFormElement | null, setShow?: Dispatch<SetStateAction<boolean>> | null);
    handle(): Promise<any>;
    protected _handleError(e: Error): void;
    protected _runHandler(): Promise<any>;
    addData(key: string, value: any): void;
}
