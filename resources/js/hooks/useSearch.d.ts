export declare const useSearch: (serverAddress: any) => {
    data: boolean;
    results: any[];
    onSearch: (val: any) => Promise<void>;
    onChoose: (val: any) => void;
};
