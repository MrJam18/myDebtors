import {Axios, AxiosResponse} from "axios";
import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {Alert} from "../../classes/Alert";
import api from "../../http/index";
import {formDataConverter} from "../../utils/formDataConverter";
import { DispatcherData } from "./Abstract/Dispatcher";


type SetError = (boolean)=> void | null;
type Update = ()=> void | null;
export interface DispatcherOptions {
    setLoading?: Dispatch<SetStateAction<boolean>>,
    formRef?:  MutableRefObject<HTMLFormElement>,
    setShow?: Dispatch<SetStateAction<boolean>>,
    update?: Update,
    alertText?: string
}

export class EasyDispatcher
{
    protected readonly _setError: Function | null;
    readonly #setLoading?: Dispatch<SetStateAction<boolean>> | null;
    readonly #setShow?: Dispatch<SetStateAction<boolean>> | null;
    readonly #update?: Update;
    readonly #alertText?: string;
    readonly #formRef?: MutableRefObject<HTMLFormElement> = null;
    public data: DispatcherData;
    public noReqData: Record<string, any>
    public afterResponse?: (response: AxiosResponse) => any;
    protected readonly _api = api;
    constructor(
        setError: SetError,
        {
            setLoading = null,
            setShow = null,
            formRef = null,
            update = null,
            alertText = null
        }: DispatcherOptions = null
    )
    {
        this._setError = setError;
        this.#setLoading = setLoading;
        this.#setShow = setShow;
        this.#update = update;
        this.data = {formData: null};
        this.noReqData = {};
        this.#alertText = alertText;
        if(formRef) this.#formRef = formRef;
    }

    async handle(serverAddress: string, method: 'post'|'get'|'put'|'delete'): Promise<AxiosResponse<any, any> | Record<any, any>>
    {
        if(this.#setLoading) this.#setLoading(true);
        if(this._setError) this._setError(false);
        if(this.#formRef) this.data.formData = formDataConverter(this.#formRef.current.elements);
        try {
            let result = await this.request(serverAddress, method, this.data);
            if(this.afterResponse) result = this.afterResponse(result)
            if(this.#setShow) this.#setShow(false);
            if(this.#update) this.#update();
            if(this.#alertText) Alert.set('Успешно', this.#alertText);
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
    public request: (serverAddress: string, method: ("post" | "get" | "put" | "delete"), data: DispatcherData) => Promise<AxiosResponse<any, any>> = async (serverAddress: string, method: 'post'|'get'|'put'|'delete', data: DispatcherData): Promise<AxiosResponse<any, any>> => {
        return await this._api[method](serverAddress, (method === 'get' || method === 'delete') ? null : data);
    }

    public addData(key: string, value: any): void
    {
        this.data[key] = value;
    }

}