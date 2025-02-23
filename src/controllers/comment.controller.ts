import { Response } from 'express';

import { CustomRequest, CommentCreationAttributes } from '../types/types';

import { Comment } from '../models/index';

export const createComment = async (req: CustomRequest<CommentCreationAttributes>, res: Response) => {
    try {
        const newComment = await Comment.create(req.body);
        res.status(201).json(newComment);
    } catch (error){
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error occurred');
        }
        res.status(500).json({ error: 'Failed to create comment' });
    }
};

export const getAllComments = async (_req: CustomRequest<CommentCreationAttributes>, res: Response) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error occurred');
        }
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
};