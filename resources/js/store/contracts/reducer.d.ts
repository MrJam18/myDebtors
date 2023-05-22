export declare const contractsSlice: import("@reduxjs/toolkit").Slice<{
    current: any;
    executiveDoc: {};
    court: any;
    list: any[];
    limitations: any[];
    totalLimitations: any[];
    existingFiles: {
        cancelDecision: {
            status: boolean;
            loading: boolean;
        };
        contract: {
            status: boolean;
            loading: boolean;
        };
        courtOrder: {
            status: boolean;
            loading: boolean;
        };
        IPEnd: {
            status: boolean;
            loading: boolean;
        };
        IPInit: {
            status: boolean;
            loading: boolean;
        };
        receivingOrder: {
            status: boolean;
            loading: boolean;
        };
    };
    loadingExisting: boolean;
    statuses: {
        id: number;
        name: string;
    }[];
}, {
    setContracts(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCurrentContract(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setExecutiveDoc(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setExecutiveDocName(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setLimitations(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setloading(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchSuccess(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchError(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchPending(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setStatuses(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setExistingFiles(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCurrentExisting(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCurrentLoadingExisting(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setLoadingExisting(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCourt(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    reset: () => {
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    };
}, "contracts">;
export declare const contractActions: import("@reduxjs/toolkit").CaseReducerActions<{
    setContracts(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCurrentContract(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setExecutiveDoc(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setExecutiveDocName(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setLimitations(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setloading(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchSuccess(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchError(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    fetchPending(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setStatuses(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setExistingFiles(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCurrentExisting(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCurrentLoadingExisting(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setLoadingExisting(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    setCourt(state: import("immer/dist/internal").WritableDraft<{
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    }>, action: {
        payload: any;
        type: string;
    }): void;
    reset: () => {
        current: any;
        executiveDoc: {};
        court: any;
        list: any[];
        limitations: any[];
        totalLimitations: any[];
        existingFiles: {
            cancelDecision: {
                status: boolean;
                loading: boolean;
            };
            contract: {
                status: boolean;
                loading: boolean;
            };
            courtOrder: {
                status: boolean;
                loading: boolean;
            };
            IPEnd: {
                status: boolean;
                loading: boolean;
            };
            IPInit: {
                status: boolean;
                loading: boolean;
            };
            receivingOrder: {
                status: boolean;
                loading: boolean;
            };
        };
        loadingExisting: boolean;
        statuses: {
            id: number;
            name: string;
        }[];
    };
}, "contracts">;
