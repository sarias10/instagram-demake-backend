import { Response } from 'express';

import { CustomRequest, LikeCreationAttributes } from '../types/types';
import { Like } from '../models/index';
import { ValidationError } from 'sequelize';

export const createDeleteLike = async (req: CustomRequest<LikeCreationAttributes>, res: Response) => {
    try {
        let like;
        if(req.body.noteId && req.body.commentId){
            throw new Error('like cant have noteId and commentId in body');
        }
        else if(req.body.noteId){ // Si envian noteId
            like = await Like.findOne({where: { userId: req.body.userId, noteId: req.body.noteId }});
        }
        else if(req.body.commentId){ // Si envia commentId
            like = await Like.findOne({where: { userId: req.body.userId, commentId: req.body.commentId }});
        }
        if(like){
            await like.destroy();
            console.log('like deleted');
            res.status(204).end();
        } else {
            const newLike = await Like.create(req.body);
            console.log('like created');
            res.status(201).json(newLike);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log(error.errors[0].message); // Error de likes repetido
        } else if (error instanceof Error) {
            console.log('Unknown error occurred', error.message);
        }
        res.status(500).json({ error: 'Failed to create like' });
        }
};

export const getAllLikes = async (_req: CustomRequest<LikeCreationAttributes>, res: Response) => {
    try {
        const likes = await Like.findAll();
        res.status(200).json(likes);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error occurred');
        }
        res.status(500).json({ error: 'Failed to retrieve likes' });
    }
};