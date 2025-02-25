import { NextFunction, Response } from 'express';

import { CustomRequest, CommentCreationAttributes } from '../types/types';

import { Comment } from '../models/index';

export const createComment = async (req: CustomRequest<CommentCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const newComment = await Comment.create(req.body);
        res.status(201).json(newComment);
    } catch (error){
        next(error);
    }
};

export const getAllComments = async (_req: CustomRequest<CommentCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};