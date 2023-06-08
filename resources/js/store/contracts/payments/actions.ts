import api from "../../../http";



export const addPayment = (payment, contractId) => async () => {
        await api.post('contracts/' + contractId + '/payments/add-one', payment);
}