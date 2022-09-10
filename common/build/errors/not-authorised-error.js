"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorisedError = void 0;
const custom_error_1 = require("./custom-error");
class NotAuthorisedError extends custom_error_1.CustomError {
    constructor() {
        super("Not Authorised");
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorisedError.prototype);
    }
    serializeErrors() {
        return [{ message: "Not Authorised" }];
    }
}
exports.NotAuthorisedError = NotAuthorisedError;
