export declare const actionsSlice: import("@reduxjs/toolkit").Slice<{
    list: any[];
    total: number;
    lastActionsList: any[];
    lastActionsTotal: number;
}, {
    changeList(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        lastActionsList: any[];
        lastActionsTotal: number;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    changeLastActionsList(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        lastActionsList: any[];
        lastActionsTotal: number;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setloading(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        lastActionsList: any[];
        lastActionsTotal: number;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchSuccess(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        lastActionsList: any[];
        lastActionsTotal: number;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchError(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        lastActionsList: any[];
        lastActionsTotal: number;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchPending(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        lastActionsList: any[];
        lastActionsTotal: number;
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "actions">;
