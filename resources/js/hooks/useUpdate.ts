import {useCallback, useEffect, useState} from "react";

type Returned = {
    state: number,
    set: ()=> void
}

export function useUpdate() {
    const [updateState, setUpdateState] = useState(0);
    const setUpdate = useCallback(()=> setUpdateState((prevState) => ++prevState), []);
    return {
        state: updateState,
        set: setUpdate
    } as Returned;
}