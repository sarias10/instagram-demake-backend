import { NextFunction, Response } from 'express';

import { CustomRequest, CommentCreationAttributes } from '../types/types';

import { Comment } from '../models/index';
// No hay que colocar next() en el bloque de try porque pasa al siguiente middleware
export const createComment = async (req: CustomRequest<CommentCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const newComment = await Comment.create(req.body);
        res.status(201).json(newComment);
    } catch (error){
        next(error);
    }
};