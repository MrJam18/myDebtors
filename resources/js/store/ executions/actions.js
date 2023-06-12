import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../http';
export const fetchExecutionInfo = createAsyncThunk('executions/fetchExecutionInfo', async (executionId, thunkAPI) => {
    try {
        const response = await api.get(`executions/${executionId}`);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const saveExecutionInfo = createAsyncThunk('executions/saveExecutionInfo', async (executionData, thunkAPI) => {
    try {
        const response = await api.post('executions', executionData);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
