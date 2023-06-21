import React, {FC, useCallback, useState} from "react";

type Returned = {
    state: boolean,
    setShow:  React.Dispatch<React.SetStateAction<boolean>>,
    Comp: () => React.ReactElement | null,
    setTrue: () => void
}

export const useShow = (Component: FC = null, props: Record<string, any> = {}) => {
    const [show, setShow] = useState(false);
    const setTrue = useCallback(() => setShow(true), []);
    props.setShow = setShow;
    let dependent = null;
    if(Component) dependent = () => show ? <Component {...props}  /> : null;
    return {
        state: show,
        setShow,
        setTrue,
        Comp: dependent
    } as Returned
}