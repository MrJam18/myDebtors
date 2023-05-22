import { useCallback, useRef } from "react";
export default function useDebounce(callback, delay) {
    const timer = useRef();
    const debouncedCallback = useCallback((...args) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'undefined... Remove this comment to see the full error message
        timer.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
    return debouncedCallback;
}
