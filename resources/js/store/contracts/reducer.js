import { createSlice } from "@reduxjs/toolkit";
const initState = {
    current: null,
    executiveDoc: {},
    court: null,
    list: [],
    limitations: [],
    totalLimitations: [],
    existingFiles: {
        cancelDecision: {
            status: false,
            loading: false
        },
        contract: {
            status: false,
            loading: false
        },
        courtOrder: {
            status: false,
            loading: false
        },
        IPEnd: {
            status: false,
            loading: false
        },
        IPInit: {
            status: false,
            loading: false
        },
        receivingOrder: {
            status: false,
            loading: false
        }
    },
    loadingExisting: true,
    statuses: [
        {
            id: 1,
            name: 'Не готов'
        }
    ],
};
export const contractsSlice = createSlice({
    name: 'contracts',
    initialState: initState,
    reducers: {
        setContracts(state, action) {
            state.list = action.payload;
        },
        setCurrentContract(state, action) {
            state.current = action.payload;
        },
        setExecutiveDoc(state, action) {
            state.executiveDoc = action.payload;
        },
        setExecutiveDocName(state, action) {
            if (state.current) {
                state.current.executiveDocName = action.payload;
            }
        },
        setLimitations(state, action) {
            state.limitations = action.payload.list;
            state.totalLimitations = action.payload.total;
        },
        setloading(state, action) {
            // @ts-expect-error TS(2339): Property 'loading' does not exist on type 'Writabl... Remove this comment to see the full error message
            state.loading = action.payload;
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
        },
        setStatuses(state, action) {
            state.statuses = action.payload;
        },
        setExistingFiles(state, action) {
            const currentState = state.existingFiles;
            for (let key in currentState) {
                currentState[key].status = action.payload[key];
            }
        },
        setCurrentExisting(state, action) {
            state.existingFiles[action.payload.fileName].status = action.payload.status;
        },
        setCurrentLoadingExisting(state, action) {
            state.existingFiles[action.payload.fileName].loading = action.payload.status;
        },
        setLoadingExisting(state, action) {
            state.loadingExisting = action.payload;
        },
        setCourt(state, action) {
            state.court = action.payload;
        },
        reset: () => initState
    },
});
export const contractActions = contractsSlice.actions;
