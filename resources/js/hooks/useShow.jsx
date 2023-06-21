import React, { useCallback, useState } from "react";
export const useShow = (Component = null, props = {}) => {
    const [show, setShow] = useState(false);
    const setTrue = useCallback(() => setShow(true), []);
    props.setShow = setShow;
    let dependent = null;
    if (Component)
        dependent = () => show ? <Component {...props}/> : null;
    return {
        state: show,
        setShow,
        setTrue,
        Comp: dependent
    };
};
