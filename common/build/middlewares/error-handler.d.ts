import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
export declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
