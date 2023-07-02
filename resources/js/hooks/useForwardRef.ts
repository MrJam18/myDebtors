import {ForwardedRef, useEffect, useRef} from "react";

export const useForwardRef = <T,>(
    ref: ForwardedRef<T>,
    initialValue: any = null
) => {
    const targetRef = useRef<T>(initialValue);
    useEffect(() => {
        // @ts-expect-error TS(2339): Property 'current' does not exist on type 'Forward... Remove this comment to see the full error message
        if(ref) ref.current = targetRef.current;
    }, [ref]);
    return targetRef;
};
