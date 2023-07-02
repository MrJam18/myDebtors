import React, {useMemo, useRef, useState} from "react";
import ButtonInForm from "../components/dummyComponents/ButtonInForm";
import {EasyDispatcher} from "../store/Dispatchers/EasyDispatcher";
import {useError} from "./useError";

type Options = {
    buttonText?: string,
    setShow?: (show: boolean)=> void,
    noDispatcher?: boolean,
    update?: ()=> void,
    alertText?: string
}
export function useForm({buttonText = null, setShow = null, noDispatcher = false, update = null, alertText = null}: Options = {}) {
    const form: React.MutableRefObject<HTMLFormElement> = useRef();
    const error = useError();
    const [loading, setLoading] = useState(false);
    const dispatcher = useMemo(()=> {
        return noDispatcher ? null : new EasyDispatcher(error.setError, {
            setLoading, formRef: form, setShow, update, alertText
        });
    }, [noDispatcher]);
    const Button = ()=> (<>
        <ButtonInForm text={buttonText} loading={loading} />
        {error.Comp()}
    </>)

    return {
        ref: form,
        ErrorComp: error.Comp,
        Button,
        setLoading,
        loading,
        setError: error.setError,
        dispatcher
    }
}