import { NextFunction, Response } from 'express';

import { CustomRequest, CommentCreationAttributes } from '../types/types';

import { Comment, User } from '../models/index';
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

        const responseComment = await Comment.findOne({
            attributes: [
                'id',
                'content',
            ],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [ 'id', 'username' ]
                }
            ],
            where: { id: newComment.id } // Buscamos el comentario del postId en el param
        });

        res.status(201).json(responseComment);
    } catch (error){
        next(error);
    }
};

export const getComments = async (req: CustomRequest<CommentCreationAttributes>, res: Response, next: NextFunction) => {
    try {

        if(!req.decodedToken){ // Decoded token esta en la interfaz CustomRequest
            throw new CustomValidationError('Unauthorized: Decoded Token not found', 401);
        }

        const { postId } = req.params;

        if(!postId){
            throw new CustomValidationError('postId in params is missing', 401);
        }

        const postComments = await Comment.findAll({
            attributes: [
                'id',
                'content',
            ],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [ 'id', 'username' ]
                }
            ],
            where: { postId: postId }, // Buscamos el comentario del postId en el param
            order: [ [ 'id','DESC' ] ]
        });

        res.status(200).json(postComments);
    } catch (error){
        next(error);
    }
};