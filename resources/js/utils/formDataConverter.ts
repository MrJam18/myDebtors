/**
 *
 * @param {object} formRef - ссылка на форму.
 * @param {array} exceptions - массив c названиями исключений name формы.
 * @returns объект со свойствами, эквивалентными аттрибутам name инпутов формы и значениями value этих инпутов, за исключением параметра exceptions.
 */
export const formDataConverter = (formRef, exceptions: Array<string> = null): Record<string, string>=> {
    const data = formRef.elements ? formRef.elements : formRef;
    let returned = {};
    const keys = Object.keys(data);

    if (exceptions) {
    keys.forEach(el => {
        for (const value of exceptions) {
            if (value === el) return
        }
        setData(el);

    });
}
    else keys.forEach(el => setData(el));
        function setData(el)
        {
            const name = data[el].name;
            if(name) {
                if(data[name].value === '') return;
                if(data[name].value === 'f') returned[name] = false;
                else if((data[name].value === 't')) returned[name] = true;
                else returned[name] = data[name].value;
            }
        }
    return returned;
}



