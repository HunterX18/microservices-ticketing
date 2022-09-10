import { CustomError } from "./custom-error";
export declare class NotAuthorisedError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
