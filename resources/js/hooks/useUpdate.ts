import {useState} from "react";

export function useUpdate() {
    const [, setUpdateState] = useState(0);
    return (): void => {
        setUpdateState((state)=> ++state);
    }
}