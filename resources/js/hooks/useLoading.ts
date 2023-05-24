import {useState} from "react";

export const useLoading = (defaultState: boolean = true) => {
    const [state, setState] = useState(defaultState);
    return {state, set: setState}
}