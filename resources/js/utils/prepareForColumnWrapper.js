export const prepareDataForColWrapper = (column, data) => {
    let element;
    if (typeof data === 'undefined')
        data = 'Не установлено';
    if (column.type === 'selected') {
        element = Object.assign(Object.assign({}, column), { colName: column.colName + 'Id', value: data.value, id: data.id });
    }
    else {
        element = Object.assign(Object.assign({}, column), { value: data });
    }
    element.show = element.value + column.showEnd;
    return element;
};
