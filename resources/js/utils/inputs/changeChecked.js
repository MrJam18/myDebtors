export function changeChecked(element, state) {
    element.checked = state;
    element.dispatchEvent(new Event('change'));
}
