const createErrorFactory = function (name: string) {
    return class BusinessError extends Error {
        constructor(message: string) {
            super(message);
            this.name = name;
        }
    };
};

export const CustomValidationError = createErrorFactory('ValidationError');

export const ConnectionError = createErrorFactory('ConnectionError');