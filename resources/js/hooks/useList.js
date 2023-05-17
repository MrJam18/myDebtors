import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "../classes/Alert";
import api from "../http/index";
const defaultOptions = {
    order: ['created_at', "DESC"],
    perPage: 10,
    page: 1,
};
function useList(serverUrl, options = defaultOptions) {
    options = useMemo(() => {
        if (options !== defaultOptions)
            return Object.assign(Object.assign({}, defaultOptions), options);
        return options;
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
        api.get(`${serverUrl}?perPage=${perPage}&page=${page}&order[]=${order[0]}&order[]=${order[1]}`)
            .then((response) => {
            var _a;
            if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.list) {
                console.log(response);
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
    useEffect(update, [order, perPage, page, serverUrl]);
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
        const samePage = page === 1;
        if (samePage)
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
        setLoading
    };
}
export default useList;
