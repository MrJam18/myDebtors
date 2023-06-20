import { useState } from "react";
export const useError = () => {
    const [error, setError] = useState<string|null>(null);
    const noError = () => {
        setError(null);
    };
    const Comp = () => error ? <div className='error'>{error}</div> : <></>;
    return { error, setError, Comp, noError };
}