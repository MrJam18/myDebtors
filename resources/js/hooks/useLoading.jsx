import React, { useState } from "react";
import Loading from "../components/dummyComponents/Loading";
export const useLoading = (defaultState = true, loadingProps = {}) => {
    const [state, setState] = useState(defaultState);
    const Comp = (Comp) => state ? <Loading {...loadingProps}/> : Comp;
    return { state, set: setState, Comp };
};
