import {useCallback, useEffect, useState} from "react";

type Returned = {
    state: boolean,
    set: ()=> void
}

export function useUpdate() {
    const [updateState, setUpdateState] = useState(false);
    const setUpdate = useCallback(()=> setUpdateState(true), [])
    useEffect(()=> {
        if(updateState) setUpdateState(false);
    }, [updateState]);
    useEffect(()=> {
        setUpdate();
    }, []);
    return {
        state: updateState,
        set: setUpdate
    } as Returned;
}