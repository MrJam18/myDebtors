export function createUpdateElementsFunc(data: Record<string, any>, elements: HTMLFormControlsCollection): (property: string) => void {
    return function (property: string) {
        if (data[property] || data[property] == 0) elements[property].value = data[property];
        else elements[property].value = '';
    }
}
