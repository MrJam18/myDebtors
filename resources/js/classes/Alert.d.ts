export declare class Alert {
    static set(header: string, text: string, type?: string): void;
    static setError(header: string, error: Error, prefix?: string | null): void;
}
