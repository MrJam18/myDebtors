export function changeChecked (element: HTMLInputElement, state: boolean): void {
    element.checked = state;
    element.dispatchEvent(new Event('change'));
}