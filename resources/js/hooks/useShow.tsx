import React, {FC, useState} from "react";

type Returned = {
    state: boolean,
    setShow:  React.Dispatch<React.SetStateAction<boolean>>,
    Comp: () => FC | null
}

export const useShow = (Component: FC | any = null, props: Record<string, any> = {}) => {
    const [show, setShow] = useState(false);
    props.setShow = setShow;
    let dependent = null;
    if(Component) dependent = () => show ? <Component {...props}  /> : null;
    return {
        state: show,
        setShow,
        Comp: dependent
    } as Returned
}