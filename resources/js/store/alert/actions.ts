export const setAlert = (header: string, text: string, type: string = 'success'): object => {
    return {
        type: 'ALERT::CHANGE',
        payload: {
            header,
            text,
            type
        }
    }
}


export const hideAlert = () => ({
    type: 'ALERT::HIDE'
})