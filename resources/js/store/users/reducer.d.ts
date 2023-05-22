declare const usersSlice: import("@reduxjs/toolkit").Slice<{
    isOnline: boolean;
    loading: boolean;
    user: {};
    error: boolean;
}, {
    login(state: import("immer/dist/internal").WritableDraft<{
        isOnline: boolean;
        loading: boolean;
        user: {};
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    logout(state: import("immer/dist/internal").WritableDraft<{
        isOnline: boolean;
        loading: boolean;
        user: {};
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setloading(state: import("immer/dist/internal").WritableDraft<{
        isOnline: boolean;
        loading: boolean;
        user: {};
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchSuccess(state: import("immer/dist/internal").WritableDraft<{
        isOnline: boolean;
        loading: boolean;
        user: {};
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchError(state: import("immer/dist/internal").WritableDraft<{
        isOnline: boolean;
        loading: boolean;
        user: {};
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchPending(state: import("immer/dist/internal").WritableDraft<{
        isOnline: boolean;
        loading: boolean;
        user: {};
        error: boolean;
    }>, action: {
        payload: any;
        type: string;
    }): void;
}, "users">;
export default usersSlice;
