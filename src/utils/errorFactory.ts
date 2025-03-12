const createErrorFactory = function (name: string) {
    return class BusinessError extends Error {
        statusCode: number;
        constructor(message: string, statusCode: number =500) {
            super(message);
            this.name = name;
            this.statusCode = statusCode;
        }
    };
};

export const CustomValidationError = createErrorFactory('ValidationError'); // Se le envia al cliente el error

export const CustomSecretValidationError = createErrorFactory('Secret Validation error'); // Solo se loggea internamente el error

export const ConnectionError = createErrorFactory('ConnectionError');