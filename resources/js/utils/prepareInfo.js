export const prepareInfo = (data) => {
    const info = data.map((el) => {
        const data = Object.assign({}, el);
        data.assigneeId = data.assignee.id;
        data.assignorId = data.assignor.id;
        delete data.assignee;
        delete data.assignor;
        delete data.prev;
        delete data.next;
        return data;
    });
    return info;
};
