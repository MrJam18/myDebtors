import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../classes/Alert";
import api from "../http/index";
const defaultOptions = {
    order: ['created_at', "DESC"],
    perPage: 10,
    page: 1,
};
function useList(serverUrl, options = defaultOptions, search = null) {
    options = useMemo(() => {
        if (options !== defaultOptions) {
            const changedOptions = {};
            for (let key in defaultOptions) {
                if (options[key])
                    changedOptions[key] = options[key];
                else
                    changedOptions[key] = defaultOptions[key];
            }
            return changedOptions;
        }
        return defaultOptions;
    }, []);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(options.page);
    const [order, setOrder] = useState(options.order);
    const [perPage, setPerPage] = useState(options.perPage);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const update = () => {
        setLoading(true);
        let url = `${serverUrl}?perPage=${perPage}&page=${page}&order[]=${order[0]}&order[]=${order[1]}`;
        if (search)
            url += '&search=' + search;
        api.get(url)
            .then((response) => {
            if (response.data.list) {
                setList(response.data.list);
                setTotalPages(response.data.totalPages);
                setTotalItems(response.data.totalItems);
            }
            else
                Alert.set('Не могу получить список', "Сервер отправил пустой ответ");
        })
            .catch((e) => {
            Alert.setError('Ошибка при получении списка', e);
        })
            .finally(() => setLoading(false));
    };
    useEffect(update, [order, perPage, page, search, serverUrl]);
    const goToPage = useCallback(function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    }, []);
    const changeItemsPerPage = useCallback(function (newItemsPerPage) {
        if (newItemsPerPage >= 1) {
            setPage(1);
            setPerPage(newItemsPerPage);
        }
    }, []);
    const updateList = useCallback(() => {
        if (page === 1)
            update();
        else
            setPage(1);
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
