import { NextFunction, Response } from 'express';

import { CustomRequest, LikeCreationAttributes } from '../types/types';
import { Like } from '../models/index';
import logger from '../utils/logger';
import { CustomValidationError } from '../utils/errorFactory';

export const createDeleteLike = async (req: CustomRequest<LikeCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        let like;
        if(req.body.noteId && req.body.commentId){
            throw new CustomValidationError('Like cant have noteId and commentId in body', 400);
        }
        else if(req.body.noteId){ // Si envian noteId
            like = await Like.findOne({ where: { userId: req.body.userId, noteId: req.body.noteId } });
        }
        else if(req.body.commentId){ // Si envia commentId
            like = await Like.findOne({ where: { userId: req.body.userId, commentId: req.body.commentId } });
        }
        if(like){
            await like.destroy();
            logger.info('like deleted');
            res.status(204).end();
        } else {
            const newLike = await Like.create(req.body);
            logger.info('like created');
            res.status(201).json(newLike);
        }
    } catch (error) {
        next(error);
    }
};

export const getAllLikes = async (_req: CustomRequest<LikeCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const likes = await Like.findAll();
        res.status(200).json(likes);
    } catch (error) {
        next(error);
    }
};