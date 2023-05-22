declare const agentsSlice: import("@reduxjs/toolkit").Slice<{
    list: any[];
    total: number;
    loading: boolean;
    error: boolean;
    order: string[];
    searchList: any[];
}, {
    setList(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setError(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setOrder(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setSearchList(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setDefaultAgent(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchSuccess(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchError(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchPending(state: import("immer/dist/internal").WritableDraft<{
        list: any[];
        total: number;
        loading: boolean;
        error: boolean;
        order: string[];
        searchList: any[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "agents">;
export default agentsSlice;
