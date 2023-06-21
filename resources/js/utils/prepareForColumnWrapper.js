export const prepareDataForColWrapper = (column, data) => {
    var _a;
    let element;
    if (typeof data === 'undefined')
        data = 'Не установлено';
    if (column.type === 'selected') {
        element = Object.assign(Object.assign({}, column), { colName: column.colName + 'Id', value: (_a = data.value) !== null && _a !== void 0 ? _a : data.name, id: data.id });
    }
    else {
        element = Object.assign(Object.assign({}, column), { value: data });
    }
    element.show = element.value + column.showEnd;
    return element;
};
