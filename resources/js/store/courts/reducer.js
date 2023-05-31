const initState = {
    list: [],
    types: [],
    levels: []
};
export const courtsReducer = (state = initState, action) => {
    switch (action.type) {
        case 'COURTS::CHANGE_LIST':
            return Object.assign(Object.assign({}, state), { list: action.payload });
        case 'COURTS::CHANGE_TYPES':
            return Object.assign(Object.assign({}, state), { types: action.payload });
        case 'COURTS::CHANGE_LEVELS':
            return Object.assign(Object.assign({}, state), { levels: action.payload });
        default:
            return state;
    }
};
