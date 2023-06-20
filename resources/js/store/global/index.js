import { setAlert } from "../alert/actions";
const initState = {
    loading: true,
    modal: false,
    error: false,
    openLeftMenu: false,
    modalQuantity: 0
};
export const globalReducer = (state = initState, action) => {
    switch (action.type) {
        case 'GLOBAL::CHANGE_LOADING':
            return Object.assign(Object.assign({}, state), { loading: action.payload });
        case 'GLOBAL::CHANGE_MODAL':
            return Object.assign(Object.assign({}, state), { modal: action.payload });
        case 'GLOBAL::CHANGE_ERROR':
            return Object.assign(Object.assign({}, state), { error: action.payload });
        case 'GLOBAL::SET_OPEN_LEFT_MENU':
            return Object.assign(Object.assign({}, state), { openLeftMenu: action.payload });
        case 'GLOBAL::ADD_MODAL_QUANTITY':
            let modalQuantity = state.modalQuantity + 1;
            if (modalQuantity === 1)
                document.body.style.overflow = 'hidden';
            return Object.assign(Object.assign({}, state), { modalQuantity: state.modalQuantity + 1 });
        case 'GLOBAL::SUBTRACT_MODAL_QUANTITY':
            let quantity = state.modalQuantity - 1;
            if (quantity === 0)
                document.body.style.overflow = 'initial';
            return Object.assign(Object.assign({}, state), { modalQuantity: quantity });
        default:
            return state;
    }
};
/**
 *
 * @param {boolean} state состояние загрузки.
 * @return {object} экшен для редьюсера
 */
export const setloading = (state = true) => ({
    type: 'GLOBAL::CHANGE_LOADING',
    payload: state
});
export const setModal = (state) => ({
    type: 'GLOBAL::CHANGE_MODAL',
    payload: state
});
export const setGlobalError = (message) => ({
    type: 'GLOBAL::CHANGE_ERROR',
    payload: message
});
export const setOpenLeftMenu = (bool) => ({
    type: 'GLOBAL::SET_OPEN_LEFT_MENU',
    payload: bool
});
export const addModalQuantity = () => ({
    type: 'GLOBAL::ADD_MODAL_QUANTITY'
});
export const subtractModalQuantity = () => ({
    type: 'GLOBAL::SUBTRACT_MODAL_QUANTITY'
});
export const errorWithAlert = (errorAction, error) => dispatch => {
    dispatch(setAlert('Ошибка', error.message, 'error'));
    dispatch(errorAction(error.message));
};
export const getLoading = state => state.global.loading;
export const getModal = state => state.global.modal;
export const getGlobalError = state => state.global.error;
export const getOpenLeftMenu = state => state.global.openLeftMenu;
export const getModalQuantity = state => state.global.modalQuantity;
