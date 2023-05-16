import {useCallback, useEffect, useMemo, useState} from "react";
import {Alert} from "../classes/Alert";
import api from "../http/index";
import {Order} from "../Types/Order";

type Options = {
    order?: Order,
    perPage?: number,
    page?: number,
}
const defaultOptions: Options = {
    order: ['created_at', "DESC"],
    perPage: 10,
    page: 1,
}

function useList(serverUrl: string, options: Options = defaultOptions) {
    options = useMemo(()=> {
        if(options !== defaultOptions) return {...defaultOptions, ...options};
        return options;
    },[]);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(options.page);
    const [order, setOrder] = useState(options.order);
    const [perPage, setPerPage] = useState(options.perPage);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const update = () => {
        setLoading(true);
        api.get(`${serverUrl}?perPage=${perPage}&page=${page}&order[]=${order[0]}&order[]=${order[1]}`)
            .then(({data}) => {
                if (data?.list) {
                    setList(data.list);
                    setTotalPages(data.totalPages);
                    setTotalItems(data.totalItems);
                } else Alert.set('Не могу получить список', "Сервер отправил пустой ответ");
            })
            .catch((e: Error) => {
                Alert.setError('Ошибка при получении списка', e);
            })
            .finally(() => setLoading(false));
    }
    useEffect(update, [order, perPage, page, serverUrl]);
    // const nextPage = useCallback(function (): void {
    //     if (page < totalPages) {
    //         setPage(page + 1);
    //     }
    // }, []);
    //
    // const prevPage = useCallback(function (): void {
    //     if (page > 1) {
    //         setPage(page - 1);
    //     }
    // }, []);


    const goToPage = useCallback(function (pageNumber: number): void {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    }, []);

    const changeItemsPerPage = useCallback(function (newItemsPerPage: number): void {
        if (newItemsPerPage >= 1) {
            setPage(1);
            setPerPage(newItemsPerPage);
        }
    }, []);

    const updateList = useCallback((): void => {
        const samePage = page === 1;
        if(samePage) update();
        else setPage(1);
    }, []);

    return {
        get: list,
        set: setList,
        order,
        page,
        perPage,
        totalPages,
        totalItems,
        setPage: goToPage,
        setPerPage: changeItemsPerPage,
        setOrder,
        update: updateList,
        loading,
        setLoading
    };
}

export default useList;