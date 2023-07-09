import React, { useState} from "react";
import Loading, {LoadingProps} from "../components/dummyComponents/Loading";

export const useLoading = (defaultState: boolean = true, loadingProps: LoadingProps = {}) => {
    const [state, setState] = useState(defaultState);
    const Comp = (Comp: React.ReactElement) => state ?  <Loading {...loadingProps} /> : Comp;
    return {state, set: setState, Comp}
}