import { Order } from "../../Types/Order";
import { Dispatcher } from "../../store/Dispatchers/Abstract/Dispatcher";
export declare function getList(dispatcher: Dispatcher, limit: number, page: number, order?: Order): void;
