import { useMemo } from "react";
import { EasyDispatcher } from "../store/Dispatchers/EasyDispatcher";
export function useDispatcher(setError, options = {}, dispatcher = null) {
    return useMemo(() => {
        if (!dispatcher) {
            const dispatcher = new EasyDispatcher(setError, options);
            if (options.request)
                dispatcher.request = options.request;
            if (options.afterResponse)
                dispatcher.afterResponse = options.afterResponse;
            return dispatcher;
        }
        else
            return dispatcher;
    }, []);
}
