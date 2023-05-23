import { useCallback, useEffect, useState } from "react";
export function useUpdate() {
    const [updateState, setUpdateState] = useState(false);
    const setUpdate = useCallback(() => setUpdateState(true), []);
    useEffect(() => {
        if (updateState)
            setUpdateState(false);
    }, [updateState]);
    useEffect(() => {
        setUpdate();
    }, []);
    return {
        state: updateState,
        set: setUpdate
    };
}
