// Controlador de salud de la API
import { Request, Response } from 'express';
import { sequelize } from '../config/database';

export const healthCheck = async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.json({ message: '✅ Database is connected' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '❌ Database is NOT connected' });
  }
};