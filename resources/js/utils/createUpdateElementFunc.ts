export function createUpdateElementsFunc(data: Record<string, any>, elements: HTMLFormControlsCollection): (property: string) => void {
    return function (property: string) {
        if (data[property]) elements[property].value = data[property];
        else elements[property].value = '';
    }
}
