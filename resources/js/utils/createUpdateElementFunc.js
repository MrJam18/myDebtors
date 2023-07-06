export function createUpdateElementsFunc(data, elements) {
    return function (property) {
        if (data[property] || data[property] == 0)
            elements[property].value = data[property];
        else
            elements[property].value = '';
    };
}
