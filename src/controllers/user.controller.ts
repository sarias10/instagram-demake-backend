import { Response } from 'express';

import { CustomRequest, UserCreationAttributes } from '../types/types';

import { User } from '../models/index';

export const createUser = async (req: CustomRequest<UserCreationAttributes>, res: Response) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error){
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error occurred');
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const getAllUsers = async (_req: CustomRequest<UserCreationAttributes>, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error occurred');
        }
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};