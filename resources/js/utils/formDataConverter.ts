/**
 *
 * @param {object} formRef - ссылка на форму.
 * @param {array} exceptions - массив c названиями исключений name формы.
 * @returns объект со свойствами, эквивалентными аттрибутам name инпутов формы и значениями value этих инпутов, за исключением параметра exceptions.
 */
export const formDataConverter = (formRef, exceptions = null)=> {
    const data = formRef.elements ? formRef.elements : formRef;
    let returned = {};
    const keys = Object.keys(data);

    if (exceptions) {
    keys.forEach(el => {
        // if(/^\d+$/.test(el) || /^mui/.test(el)) return;
        for (const value of exceptions) {
            if (value === el) return
        }
        setData(el);
        // object[data[el].name] = data[el].value;
        // returned = getValue(el, data);
        // returned = keys.map(el => getValue(el, data));

    });
}
    else keys.forEach(el => setData(el));
        //     if(!el || /^\d+$/.test(el) || /^mui/.test(el)) return;
        //     object[data[el].name] = data[el].value;
        // returned = keys.map(el => getValue(el, data));

        function setData(el)
        {
            const name = data[el].name;
            if(name) returned[name] = data[name].value;
        }
    return returned;
}



