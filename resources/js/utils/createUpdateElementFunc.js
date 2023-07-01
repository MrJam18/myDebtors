export function createUpdateElementsFunc(data, elements) {
    return function (property) {
        if (data[property])
            elements[property].value = data[property];
        else
            elements[property].value = '';
    };
}
