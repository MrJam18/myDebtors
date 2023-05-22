export declare const paymentsSlice: import("@reduxjs/toolkit").Slice<{
    list: any[];
    total: number;
    loading: boolean;
    error: boolean;
}, {
    setList(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setTotal(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setloading(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchSuccess(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchError(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchPending(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "PAYMENTS">;
