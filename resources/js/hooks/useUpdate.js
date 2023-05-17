import { useState } from "react";
export function useUpdate() {
    const [, setUpdateState] = useState(0);
    return () => {
        setUpdateState((state) => ++state);
    };
}
