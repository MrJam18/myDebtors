
export const prepareDataForColWrapper = (column, data) => {
    let element;
    if(typeof data === 'undefined') data = 'Не установлено';
    if(column.type === 'selected') {
        element = {
            ...column,
            colName: column.colName + 'Id',
            value: data.value ?? data.name,
            id: data.id
        }
    }
    else {
        element = {
            ...column,
            value: data
        }
    }
    element.show = element.value + column.showEnd;
    return element;
}