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

export const CustomValidationError = createErrorFactory('ValidationError');

export const ConnectionError = createErrorFactory('ConnectionError');