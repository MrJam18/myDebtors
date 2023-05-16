import { Order } from "../../../Types/Order";
import { DispatcherAlerter } from "./DispatcherAlerter";
export declare abstract class ListDispatcher extends DispatcherAlerter {
    page: number;
    limit: number;
    serverAddress: string;
    orderBy: Order | null;
    protected _runHandler(): Promise<any>;
}
