import { useCallback, useState } from "react";
export function useUpdate() {
    const [updateState, setUpdateState] = useState(0);
    const setUpdate = useCallback(() => setUpdateState((prevState) => ++prevState), []);
    return {
        state: updateState,
        set: setUpdate
    };
}
