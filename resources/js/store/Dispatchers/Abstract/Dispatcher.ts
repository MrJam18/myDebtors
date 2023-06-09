import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {formDataConverter} from "../../../utils/formDataConverter";
import {dispatch, getState, store} from "../../../App.jsx";
import api from "../../../http";
import {CaseReducerActions, SliceCaseReducers} from "@reduxjs/toolkit";

export type DispatcherData =  {
    [key: string]: any,
    formData: Record<string, any> | null
}
type SetError = (boolean)=> void | null;
type Update = ()=> void | null;


export abstract class Dispatcher
{
    protected readonly _setError: Function | null;
    readonly #setLoading?: Dispatch<SetStateAction<boolean>> | null;
    readonly #setShow?: Dispatch<SetStateAction<boolean>> | null;
    readonly #update?: Update;
    public data: DispatcherData;
    public noReqData: Record<string, any>
    protected readonly _dispatch: typeof store.dispatch = dispatch;
    protected readonly _getState: typeof store.getState = getState;
    protected readonly _api = api;
    protected _actions:  CaseReducerActions<SliceCaseReducers<unknown>, string> | null = null;
    protected abstract _handler(dispatcherData: DispatcherData): Promise<any>;
    constructor(
        setError: SetError,
        setLoading: Dispatch<SetStateAction<boolean>> | null = null,
        formRef:  MutableRefObject<HTMLFormElement> | null = null,
        setShow: Dispatch<SetStateAction<boolean>> | null = null,
        update: Update = null
    )
    {
        if(setError) this._setError = setError;
        this.#setLoading = setLoading;
        this.#setShow = setShow;
        this.#update = update;
        this.data = {formData: null};
        this.noReqData = {};
        if(formRef) this.data.formData = formDataConverter(formRef.current.elements);
    }

    async handle()
    {
        if(this.#setLoading) this.#setLoading(true);
        if(this._setError) this._setError(false);
        try {
            if(!this._handler){
                throw new Error('handler dont created');
            }
            const result = await this._runHandler();
            if(this.#setShow) this.#setShow(false);
            if(this.#update) this.#update();
            return result;
        }
        catch (e: any) {
            console.dir(e);
            if(e.response?.data) console.dir(e.response.data);
            this._handleError(e);
        }
        finally {
            if(this.#setLoading) this.#setLoading(false);
        }
    }

    protected _handleError(e: any): void
    {
        if(e.response?.status === 551) return this._setError(e.response.data.message);
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
    public addNoReqData(key: string, value: any): void
    {
        this.noReqData[key] = value;
    }

}