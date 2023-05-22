const initState = {
    total: 0,
    list: [],
    names: []
};
export const tasksReducer = (state = initState, action) => {
    switch (action.type) {
        case 'TASKS::SET_LIST':
            return Object.assign(Object.assign({}, state), { list: action.payload.list, total: action.payload.total });
        default:
            return state;
    }
};
