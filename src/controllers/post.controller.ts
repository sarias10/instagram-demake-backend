import { NextFunction, Response } from 'express';

import { CustomRequest, PostAttributes, PostCreationAttributes, PostWithMediaAttributes, UploadToS3Attributes } from '../types/types';
import { Post, PostMedia, User } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';
import { config } from '../config/env';

const awsCloudformationDomain = config.aws.awsCloudformationDomain;

export const createPost = async (req: CustomRequest<UploadToS3Attributes>, res: Response, next: NextFunction) => {
    try {
        const { description, uploadedFiles } = req.body;

        if (!req.decodedToken) {
            throw new CustomValidationError('Unauthorized: Token not found', 401);
        }
        if(uploadedFiles.length===0){
            throw new CustomValidationError('No files uploaded', 400);
        }
        console.log('uploaded files', uploadedFiles);
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

export const getAllVisiblePosts = async (req: CustomRequest<PostCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){
            throw new CustomValidationError('Unauthorized: Token not found',401);
        }

        const posts: PostWithMediaAttributes[] = await Post.findAll({
            include: [
                { model: PostMedia, as: 'media' },
                { model: User, as: 'author',
                    where: { visible: true },
                    attributes: [ 'username' ]
                }
            ]
        });

        // Generar URLs usando CloudFront
        posts.forEach(post => {
            if (Array.isArray(post.media)) {
                post.media.forEach(media => {
                    media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
                });
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

export const getAllPostsFromLoggedUser = async (req: CustomRequest<PostCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){
            throw new CustomValidationError('Unauthorized: Token not found',401);
        }
        const { id } = req.decodedToken;
        const posts: PostWithMediaAttributes[] = await Post.findAll({
            where: { userId: id },
            include: [ { model: PostMedia, as: 'media' } ]
        });

        // Generar URLs usando CloudFront
        posts.forEach(post => {
            if (Array.isArray(post.media)) {
                post.media.forEach(media => {
                    media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
                });
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

interface PostFromOtherVisibleUser extends PostAttributes {
    username: string;
}
export const getAllVisblePostsFromUser = async (req: CustomRequest<PostFromOtherVisibleUser>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){
            throw new CustomValidationError('Unauthorized: Token not found',401);
        }
        const username =  req.body.username;
        if(!username){
            throw new CustomValidationError('username is missing');
        }
        const user = await User.findOne({ where: { username: username } });

        if(!user){
            throw new CustomValidationError('username does not exist');
        }
        if(!user.visible){
            throw new CustomValidationError('username is not public');
        }
        const posts: PostWithMediaAttributes[] = await Post.findAll({
            include: [ { model: PostMedia, as: 'media' },
                { model: User, as: 'author',
                    where: { username: user.username },
                    attributes: [ 'id', 'username', 'name', 'visible' ]
                }
            ]
        });

        // Generar URLs usando CloudFront
        posts.forEach(post => {
            if (Array.isArray(post.media)) {
                post.media.forEach(media => {
                    media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
                });
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};