/// <reference types="react" />
export default function useInput(initialValue: any): {
    value: any;
    onChange: (e: any) => void;
    setValue: import("react").Dispatch<any>;
};
