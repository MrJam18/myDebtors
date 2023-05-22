import { Order } from "../Types/Order";
declare type Options = {
    order: Order;
    perPage: number;
    page: number;
};
declare function useList(serverUrl: any, options?: Options): {
    get: any[];
    page: number;
    totalPages: number;
    totalItems: number;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (pageNumber: any) => void;
    setPerPage: (newItemsPerPage: any) => void;
};
export default useList;
