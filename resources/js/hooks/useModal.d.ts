/// <reference types="react" />
export default function useModal(): {
    show: boolean;
    setShow: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setShowTrue: () => void;
};
