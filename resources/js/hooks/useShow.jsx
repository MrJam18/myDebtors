import React, { useState } from "react";
export const useShow = (Component = null, props = {}) => {
    const [show, setShow] = useState(false);
    props.setShow = setShow;
    let dependent = null;
    if (Component)
        dependent = () => show ? <Component {...props}/> : null;
    return {
        state: show,
        setShow,
        Comp: dependent
    };
};
