import {AxiosResponse} from "axios";
import {useMemo} from "react";
import {Dispatcher, DispatcherData} from "../store/Dispatchers/Abstract/Dispatcher";
import {DispatcherOptions, EasyDispatcher} from "../store/Dispatchers/EasyDispatcher";

interface Options extends DispatcherOptions {
    request?: (serverAddress: string, method: 'post'|'get'|'put'|'delete', data: DispatcherData) => Promise<AxiosResponse<any, any>>
    afterResponse?: (response: AxiosResponse) => any;
}
export function useDispatcher(setError: (e: string)=> void, options: Options = {}, dispatcher: Dispatcher|EasyDispatcher = null) {
    return useMemo(() => {
        if (!dispatcher) {
            const dispatcher = new EasyDispatcher(setError, options);
            if (options.request) dispatcher.request = options.request;
            if (options.afterResponse) dispatcher.afterResponse = options.afterResponse;
            return dispatcher;
        } else return dispatcher;
    }, []);
}