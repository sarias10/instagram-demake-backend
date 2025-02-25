import { NextFunction, Response } from 'express';
import brcrypt from 'bcrypt';

import { CustomRequest, UserCreationAttributes } from '../types/types';

import { User } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';

export const createUser = async (req: CustomRequest<UserCreationAttributes>, res: Response, next: NextFunction) => {
    const { username, name, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { username: username } });
        if(existingUser){
            throw new CustomValidationError('Username must be unique');
        }
        if(!password){
            throw new CustomValidationError('Password is missing');
        }
        if(password.length >= 3){
            const saltRounds = 10;
            //ciframos la contraseña recibida
            const passwordHash = await brcrypt.hash(password, saltRounds);

            //creamos un nuevo objeto usuario
            const newUser = await User.create({
                username,
                name,
                password: passwordHash
            });
            // Se responde con el usuario creado
            res.status(201).json(newUser);
            // Se imprime en consola el usuario creado
        } else {
            throw new CustomValidationError('The password must be at least 3 characters long.');
        }
    } catch (error){
        next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const getAllUsers = async (_req: CustomRequest<UserCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};