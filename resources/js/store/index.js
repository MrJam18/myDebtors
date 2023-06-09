import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { debtorsReducer } from './debtors/reducer';
import { contractsSlice } from './contracts/reducer';
import { cessionsSlice } from './cessions/reducer';
import { organizationsSlice } from './creditors/reducer';
import { alertReducer } from './alert/reducer';
import { globalReducer } from './global';
import { paymentsSlice } from './contracts/payments/reducer';
import { courtsReducer } from './courts/reducer';
import { actionsSlice } from './actions/reducer';
import usersSlice from './users/reducer';
import { tasksReducer } from './tasks/reducer';
import agentsSlice from './agents/reducer';
import { bailiffsSlice } from './bailiffs/reducer';
import { listSlice } from "./list/reducer";
import { executionsSlice } from './ executions/reducer';
const rootReducer = combineReducers({
    courts: courtsReducer,
    payments: paymentsSlice.reducer,
    alert: alertReducer,
    organizations: organizationsSlice.reducer,
    executions: executionsSlice.reducer,
    cessions: cessionsSlice.reducer,
    debtors: debtorsReducer,
    global: globalReducer,
    actions: actionsSlice.reducer,
    users: usersSlice.reducer,
    tasks: tasksReducer,
    agents: agentsSlice.reducer,
    contracts: contractsSlice.reducer,
    bailiffs: bailiffsSlice.reducer,
    list: listSlice.reducer
});
export const setupStore = () => configureStore({
    reducer: rootReducer
});
