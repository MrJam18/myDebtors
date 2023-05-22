export declare const listSlice: import("@reduxjs/toolkit").Slice<{
    data: any[];
    totalRows: number;
    loading: boolean;
}, {
    changeList(state: import("immer/dist/internal").WritableDraft<{
        data: any[];
        totalRows: number;
        loading: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setListLoading(state: import("immer/dist/internal").WritableDraft<{
        data: any[];
        totalRows: number;
        loading: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "list">;
