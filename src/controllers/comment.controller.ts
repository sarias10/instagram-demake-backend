import { NextFunction, Response } from 'express';

import { CustomRequest, CommentCreationAttributes } from '../types/types';

import { Comment } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';
// No hay que colocar next() en el bloque de try porque pasa al siguiente middleware
export const createComment = async (req: CustomRequest<CommentCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const { postId, content } = req.body;
        if(!req.decodedToken){ // Decoded token esta en la interfaz CustomRequest
            throw new CustomValidationError('Unauthorized: Decoded Token not found', 401);
        }
        if(!postId){
            throw new CustomValidationError('postId is missing', 400);
        }
        if(!content){
            throw new CustomValidationError('content is missing', 400);
        }
        const { id } = req.decodedToken;
        const newComment = await Comment.create({
            content: content,
            userId: id,
            postId: postId,
        });
        res.status(201).json(newComment);
    } catch (error){
        next(error);
    }
};