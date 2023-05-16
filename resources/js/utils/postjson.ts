export const postjson = async (route, data) => {
    try{
    const response = await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(data)
    })
    if (response.ok) return await response.json();
    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    else if(response.status === 401) throw new Error(response.status);
    else throw new Error(`ошибка POST запроса. Код: ${response.status}. ${response.statusText}`)
    }
    catch(e){ 
        throw new Error(e.message)
    }
    
}