import {AxiosRequestConfig} from "axios";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Alert} from "../classes/Alert";
import api from "../http/index";
import {Order} from "../Types/Order";

export type FilterElement = {
    operator: string,
    key:string,
    value: string
}


type Options = {
    order?: Order,
    perPage?: number,
    page?: number,
    filter?: Array<FilterElement>,
    method?: 'get' | 'post'
}
const defaultOptions: Options = {
    order: ['created_at', "DESC"],
    perPage: 10,
    page: 1,
    method: 'get'
}

function useList(serverUrl: string, options: Options = defaultOptions, search: string = null) {
    options = useMemo(()=> {
        const changedOptions = options;
        for(let key in defaultOptions) {
            if(!changedOptions[key]) changedOptions[key] = defaultOptions[key];
        }
        return changedOptions;
    },[options.filter]);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(options.page);
    const [order, setOrder] = useState(options.order);
    const [perPage, setPerPage] = useState(options.perPage);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const update = () => {
        setLoading(true);
        const config: AxiosRequestConfig = {
            method: options.method
        }
        const params = {
            perPage,
            page,
            order
        } as Record<string, any>;
        if(search) params.search = search;
        if(options.filter) params.filter = options.filter;
        if(options.method === 'get') config.params = params;
        else config.data = params;
        api(serverUrl, config)
            .then((response) => {
                if (response.data.list) {
                    setList(response.data.list);
                    setTotalPages(response.data.totalPages);
                    setTotalItems(response.data.totalItems);
                } else Alert.set('Не могу получить список', "Сервер отправил пустой ответ");
            })
            .catch((e: Error) => {
                Alert.setError('Ошибка при получении списка', e);
            })
            .finally(() => setLoading(false));
    }
    useEffect(update, [order, perPage, page, search, serverUrl, options.filter]);
    const goToPage = useCallback(function (pageNumber: number): void {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    }, [totalPages]);

    const changeItemsPerPage = useCallback(function (newItemsPerPage: number): void {
        if (newItemsPerPage >= 1) {
            setPage(1);
            setPerPage(newItemsPerPage);
        }
    }, []);

    const updateList = useCallback((): void => {
        if(page === 1) update();
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
        setLoading,
    };
}

export default useList;