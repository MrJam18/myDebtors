import {useCallback, useEffect, useState} from "react";

export type Update = ()=> void;
export type UpdateState = number;

type Returned = {
    state: UpdateState,
    set: Update
}

export function useUpdate() {
    const [updateState, setUpdateState] = useState(0);
    const setUpdate = useCallback(()=> setUpdateState((prevState) => ++prevState), []);
    return {
        state: updateState,
        set: setUpdate
    } as Returned;
}