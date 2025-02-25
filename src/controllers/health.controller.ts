// Controlador de salud de la API
import { NextFunction, Request, Response } from 'express';
import { sequelize } from '../config/database';

export const healthCheckDatabase = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        await sequelize.authenticate();
        res.json({ message: '✅ Database is connected' });
    } catch (error) {
        next(error);
    }
};

export const healthChecService = (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ message: '✅ Service is connected' });
    } catch (error) {
        next(error);
    }
};