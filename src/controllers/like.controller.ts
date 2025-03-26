import { NextFunction, Response } from 'express';

import { CustomRequest, LikeCreationAttributes } from '../types/types';
import { Like, Post } from '../models/index';
import logger from '../utils/logger';
import { CustomSecretValidationError, CustomValidationError } from '../utils/errorFactory';

export const createOrDeleteLike = async (req: CustomRequest<LikeCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        let like;
        let newLike;
        const { postId, commentId } = req.body;
        if(!req.decodedToken){
            throw new CustomSecretValidationError('Unauthorized: Decoded Token not found', 401);
        }
        const post = await Post.findOne({ where: { id: postId } });
        if(!post){
            throw new CustomValidationError('post does not exist', 404);
        }
        const { id } = req.decodedToken;
        if(!postId && !commentId){ // Si faltan los dos
            throw new CustomValidationError('postId or commentId is missing');
        }
        if(req.body.postId && req.body.commentId){ // Si estan los dos
            throw new CustomValidationError('Like cant have postId and commentId in body', 400);
        }
        else if(postId){ // Si envian postId
            like = await Like.findOne({ where: { userId: id, postId: postId } });
        }
        else if(commentId){ // Si envian commentId
            like = await Like.findOne({ where: { userId: id, commentId: commentId } });
        }
        if(like){ // Si like existe en la base de datos se elimina
            await like.destroy();
            logger.info('like deleted');
            res.status(204).end();
        } else { // Si like no existe en la base de datos, se crea
            if(postId){// Si en la request viene postId
                newLike = await Like.create({
                    userId: id,
                    postId: postId,
                });
            } else{// Si en la request viene commentId
                newLike = await Like.create({
                    userId: id,
                    commentId: commentId,
                });
            }
            logger.info('like created');
            res.status(201).json(newLike);
        }
    } catch (error) {
        next(error);
    }
};