import { Request, Response, NextFunction } from 'express';
//import logger from '../utils/logger';
import { ValidationError } from 'sequelize';
import logger from '../utils/logger';
import { CustomSecretValidationError, CustomValidationError } from '../utils/errorFactory';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { CustomTokenRequest } from '../types/types';

//import { CustomTokenRequest } from '../types/types';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
    logger.info('Method: ', req.method);
    logger.info('Path: ', req.path);
    // Convierte el cuerpo de la solicitud (req.body) en un string JSON.
    // El 'null' indica que no se aplicará ninguna transformación a las claves y valores.
    // El '2' añade una indentación de 2 espacios, haciendo el JSON más legible.
    logger.info('Body: ',JSON.stringify(req.body, null,2));
    logger.info(new Date().toLocaleString('es-CO'));
    logger.info('---');
    next();
};

const unknownEndpoint = (_req:Request, res: Response) => {
    res.status(404).send({ error: 'unknown endpoint' });
};
// void se usa para indicar que una función no devuelve un valor o llaman a next(), sin devolver un valor.
const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction): void => {
    if(error instanceof ValidationError){
        logger.error(error.name + ':', error.message);
        res.status(400).json({ message: `Validation error: ${error.errors[0].message}` }); // Como es validación entonces si se le puede enviar el mensaje al usuario
        // Detiene la ejecución aquí para que no vuelva a imprimir el error en la consola
        return;
    }
    else if(error instanceof CustomValidationError){
        logger.error(error.name + ':', error.message);
        res.status(error.statusCode).json({ message: `Validation error: ${error.message}` });
        return;
    }
    else if(error instanceof CustomSecretValidationError){
        logger.error(error.name + ':', error.message);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
    else {
        res.status(500).json({ message: 'Internal server error' });
    }
    next(error);
    // Pasar el error al siguiente middleware si no es de validación
};

const tokenExtractor = (req: CustomTokenRequest, _res: Response, next: NextFunction) => {
    try {
    // Se obtiene el encabezado authorization de la solicitud
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token){
            throw new CustomValidationError('No token provided', 401);
        }
        const decoded = jwt.verify(token, config.secret);
        req.decodedToken = decoded;

        next();
    }catch(error){
        next(error);
    }
};

export { errorHandler, requestLogger, tokenExtractor, unknownEndpoint };