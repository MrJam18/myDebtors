import {createSlice} from "@reduxjs/toolkit";
import {getLastInfo} from "../../utils/getLastinfo";

const initialState = {
    info: {
        rows: [],
        loading: true,
        data: null, // здесь мы будем хранить информацию об исполнительном производстве
        error: false,
        submitLoading: false,
        showConfirm: false,
        executionId: null,
        show: false,
        deleteIds: [],
        forceUpdateState: false,
        lastInfo: null,
    }
}

export const executionsSlice = createSlice({
    name: 'executions',
    initialState,
    reducers: {
        setInfoLoading(state, action) {
            // устанавливает значение info.loading в состояние "загрузка данных"
            state.info.loading = action.payload;
        },
        setInfoData(state, action) {
            // устанавливает значение info.data, содержащее данные об исполнительном производстве
            state.info.data = action.payload;
        },
        setInfoError(state, action) {
            // устанавливает значение info.error в случае ошибки
            state.info.error = action.payload;
        },
        setSubmitInfoLoading(state, action) {
            // устанавливает значение info.submitLoading в состояние "отправка данных"
            state.info.submitLoading = action.payload;
        },
        setInfoShowConfirm(state, action) {
            // устанавливает значение info.showConfirm для отображения подтверждения
            state.info.showConfirm = action.payload;
        },
        setInfoExecutionId(state, action) {
            // устанавливает значение info.executionId, хранящее идентификатор исполнительного производства
            state.info.executionId = action.payload;
            state.info.show = true;
        },
        setInfoShow(state, action) {
            // устанавливает значение info.show для управления видимостью деталей исполнительного производства
            state.info.show = action.payload;
        },
        setInfoDefault(state) {
            // сбрасывает info обратно к initialState
            state.info = initialState.info;
        },
        pushDeleteId(state, action) {
            // добавляет идентификатор для удаления в info.deleteIds
            state.info.deleteIds.push(action.payload);
        },
        forceUpdate(state) {
            // меняет значение info.forceUpdateState на противоположное для принудительного обновления компонентов
            state.info.forceUpdateState = !state.info.forceUpdateState;
        },
        setLastInfo(state) {
            state.info.lastInfo = getLastInfo(state.info.rows);
        }
    }
});
