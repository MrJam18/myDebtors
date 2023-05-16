import { useState } from "react";
export const useError = () => {
    const [error, setError] = useState(false);
    const noError = () => {
        setError(false);
    };
    const Comp = () => error ? <div className='error'>{error}</div> : <></>;
    return { error, setError, Comp, noError };
}