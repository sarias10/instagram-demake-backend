import { NextFunction, Response } from 'express';

import { CustomRequest, PostCreationAttributes, UploadToS3Attributes } from '../types/types';
import { Post, PostMedia } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';

export const createPost = async (req: CustomRequest<UploadToS3Attributes>, res: Response, next: NextFunction) => {
    try {
        const { description, uploadedFiles } = req.body;

        if (!req.decodedToken) {
            throw new CustomValidationError('Unauthorized: Token not found', 401);
        }

        // decodedToken tiene username y id pero solo uso id
        const { id: userId } = req.decodedToken;

        // Crear el nuevo post en la base de datos
        const newPost = await Post.create({
            description,
            userId
        });

        // Si se subieron archivos, guardarlos en la tabla PostMedia
        if (uploadedFiles && uploadedFiles.length > 0) {
            const postMediaData = uploadedFiles.map((file) => ({
                postId: newPost.id,
                mediaUrl: file.mediaUrl,
                mediaType: file.mediaType
            }));

            await PostMedia.bulkCreate(postMediaData);
        }

        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};

export const getAllPostsByUserId = async (req: CustomRequest<PostCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){
            throw new CustomValidationError('Unauthorized: Token not found',401);
        }
        const { id } = req.decodedToken;
        const posts = await Post.findAll({
            where: {
                userId: id
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};