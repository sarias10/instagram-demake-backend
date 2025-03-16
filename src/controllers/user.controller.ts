import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';

import { CustomRequest, CustomTokenRequest, UserCreationAttributes } from '../types/types';

import { User } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';

export const createUser = async (req: CustomRequest<UserCreationAttributes>, res: Response, next: NextFunction) => {
    const { username, name, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { username: username } });
        if(existingUser){
            throw new CustomValidationError('Username must be unique', 400);
        }
        if(!password){
            throw new CustomValidationError('Password is missing', 400);
        }
        if(password.length >= 3){
            const saltRounds = 10;
            //ciframos la contraseña recibida
            const passwordHash = await bcrypt.hash(password, saltRounds);

            //creamos un nuevo objeto usuario
            const newUser = await User.create({
                username,
                name,
                password: passwordHash
            });
            // Se responde con el usuario creado
            res.status(201).json(newUser);
        } else {
            throw new CustomValidationError('The password must be at least 3 characters long.', 400);
        }
    } catch (error){
        next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const getAllUsers = async (req: CustomTokenRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.decodedToken) {
            throw new CustomValidationError('Unauthorized: Invalid token', 401);
        }

        const users = await User.findAll({
            attributes: [ 'id', 'username', 'name', 'visible' ]
        });
        res.status(200).json(users);
    } catch (error){
        next(error); // Pasa el error al middleware de manejo de errores
    }
};

// pide token en otro lado, no me acuerdo en donde
export const getUserByUsername = async (req: CustomTokenRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.decodedToken) {
            throw new CustomValidationError('Unauthorized: Invalid token', 401);
        }

        const { username } = req.params;

        if(!username){
            throw new CustomValidationError('username is missing', 400);
        }

        if (typeof username !== 'string') {
            throw new CustomValidationError('Invalid username format',400);
        }

        const user = await User.findOne({
            where: { username: username },
            attributes: [ 'id', 'username', 'name', 'visible' ]
        });

        if(!user){
            throw new CustomValidationError('username does not exist', 400);
        }

        res.status(200).json(user);
    } catch (error){
        next(error); // Pasa el error al middleware de manejo de errores
    }
};
