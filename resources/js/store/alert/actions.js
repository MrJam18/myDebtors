export const setAlert = (header, text, type = 'success') => {
    return {
        type: 'ALERT::CHANGE',
        payload: {
            header,
            text,
            type
        }
    };
};
export const hideAlert = () => ({
    type: 'ALERT::HIDE'
});
