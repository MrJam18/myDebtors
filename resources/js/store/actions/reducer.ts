import { createSlice } from "@reduxjs/toolkit";
import { setAlert } from "../alert/actions";

const initState = {
    list: [],
    total: 0,
    lastActionsList: [],
    lastActionsTotal: 0
}


export const actionsSlice = createSlice({
    name: 'actions',
    initialState: initState,
    reducers: {
        changeList(state, action){
            state.list = action.payload.list;
            state.total = action.payload.total;
        },
        changeLastActionsList(state, action) {
            state.lastActionsList = action.payload.list;
            state.lastActionsTotal = action.payload.total;
        },
        setloading(state, action) {
            // @ts-expect-error TS(2339): Property 'loading' does not exist on type 'Writabl... Remove this comment to see the full error message
            state.loading = action.payload
        },
        fetchSuccess(state, action) {
            // @ts-expect-error TS(2339): Property 'error' does not exist on type 'WritableD... Remove this comment to see the full error message
            state.error = false;
            // @ts-expect-error TS(2339): Property 'loading' does not exist on type 'Writabl... Remove this comment to see the full error message
            state.loading = false;
        },
        fetchError(state, action) {
            // @ts-expect-error TS(2339): Property 'loading' does not exist on type 'Writabl... Remove this comment to see the full error message
            state.loading = false;
            // @ts-expect-error TS(2339): Property 'error' does not exist on type 'WritableD... Remove this comment to see the full error message
            state.error = action.payload;
            
        },
        fetchPending(state, action) {
            // @ts-expect-error TS(2339): Property 'loading' does not exist on type 'Writabl... Remove this comment to see the full error message
            state.loading = true;
        }
    },
})