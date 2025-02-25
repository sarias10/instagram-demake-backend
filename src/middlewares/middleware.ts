import { Request, Response, NextFunction } from 'express';
//import logger from '../utils/logger';
import { ValidationError } from 'sequelize';
import logger from '../utils/logger';
import { CustomValidationError } from '../utils/errorFactory';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
    logger.info('Method: ', req.method);
    logger.info('Path: ', req.path);
    // Convierte el cuerpo de la solicitud (req.body) en un string JSON.
    // El 'null' indica que no se aplicará ninguna transformación a las claves y valores.
    // El '2' añade una indentación de 2 espacios, haciendo el JSON más legible.
    logger.info('Body: ',JSON.stringify(req.body, null,2));
    logger.info('---');
    next();
};

// void se usa para indicar que una función no devuelve un valor o llaman a next(), sin devolver un valor.
const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction): void => {
    logger.error(error.name + ':', error.message);
    if(error instanceof ValidationError){
        res.status(400).json({ error: error.errors[0].message }); // Como es validación entonces si se le puede enviar el mensaje al usuario
        // Detiene la ejecución aquí para que no vuelva a imprimir el error en la consola
        return;
    }
    if(error instanceof CustomValidationError){
        res.status(400).json({ error: error.message });
        return;
    }
    else {
        res.status(500).json({ message: 'Internal server error' });
    }
    // Pasar el error al siguiente middleware si no es de validación
    logger.info('---');
    next(error);
};

export { errorHandler, requestLogger };