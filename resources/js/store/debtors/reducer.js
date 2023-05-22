const initState = {
    list: [],
    totalRows: 0,
    loading: true
};
export const debtorsReducer = (state = initState, action) => {
    switch (action.type) {
        case 'DEBTORS::CHANGE_LIST':
            return Object.assign(Object.assign({}, state), { list: action.payload.list, totalRows: action.payload.total });
        case 'DEBTORS::SET_LOADING':
            return Object.assign(Object.assign({}, state), { loading: action.payload });
        default:
            return state;
    }
};
