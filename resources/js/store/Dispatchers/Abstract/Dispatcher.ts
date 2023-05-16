import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {formDataConverter} from "../../../utils/formDataConverter";
import {dispatch, getState, store} from "../../../App.jsx";
import api from "../../../http";
import {CaseReducerActions, SliceCaseReducers} from "@reduxjs/toolkit";

export type DispatcherData =  {
    [key: string]: any,
    formData: Record<string, any> | null
}


export abstract class Dispatcher
{
    protected readonly _setError: Function | null;
    readonly #setLoading: Dispatch<SetStateAction<boolean>>;
    readonly #setShow: Dispatch<SetStateAction<boolean>> | null;
    public data: DispatcherData;
    protected readonly _dispatch: typeof store.dispatch = dispatch;
    protected readonly _getState: typeof store.getState = getState;
    protected readonly _api = api;
    protected _actions:  CaseReducerActions<SliceCaseReducers<unknown>, string> | null = null;
    abstract _handler(dispatcherData: DispatcherData): Promise<any>;
    /**
     *
     * @param {function} setError function which change error state
     * @param {function} setLoading function which change loading state
     * @param {function} setShow function which change show state for close modalWindow
     * @param {object} formRef formRef what inserted to data properties
     */
    constructor(setError: Function | null, setLoading: Dispatch<SetStateAction<boolean>>, formRef:  MutableRefObject<HTMLFormElement> | null = null, setShow: Dispatch<SetStateAction<boolean>> | null = null)
    {
        if(setError) this._setError = setError;
        this.#setLoading = setLoading;
        this.#setShow = setShow;
        this.data = {formData: null};
        if(formRef) this.data.formData = formDataConverter(formRef.current.elements);
    }

    async handle()
    {
        this.#setLoading(true);
        if(this._setError) this._setError(false);
        try {
            if(!this._handler){
                throw new Error('handler dont created');
            }
            const result = await this._runHandler();
            if(this.#setShow) this.#setShow(false);
            return result;
        }
        catch (e: any) {
            console.dir(e);
            if(e.response?.data) console.dir(e.response.data);
            this._handleError(e);
        }
        finally {
            this.#setLoading(false);
        }
    }

    protected _handleError(e: Error): void
    {
        if(this._setError) this._setError(e.message);
    }

    protected async _runHandler()
    {

        return await this._handler(this.data);
    }

    public addData(key: string, value: any): void
    {
        this.data[key] = value;
    }


}
