export type CreateMethodType = "POST";

export interface AnalyzeTextRequest {
    text: string;
}

export interface AnalyzeTextResponse {
    generated_text: string;
}

export interface AnalyzeTextError {
    message: string;
}

export type AnalyzeTextResult = AnalyzeTextResponse | AnalyzeTextError;


export class CustomError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }

    static fromError(error: Error, statusCode: number): CustomError {
        return new CustomError(error.message, statusCode);
    }

    static fromMessage(message: string, statusCode: number): CustomError {
        return new CustomError(message, statusCode);
    }

    static fromStatus(statusCode: number): CustomError {
        return new CustomError("", statusCode);
    }


}