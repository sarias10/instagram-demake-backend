import { NextFunction, Response } from 'express';

import { CustomRequest, PostCreationAttributes, PostWithMediaAttributes, UploadToS3Attributes } from '../types/types';
import { Post, PostMedia, User } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';
import { config } from '../config/env';
import { sequelize } from '../config/database';

const awsCloudformationDomain = config.aws.awsCloudformationDomain;

export const createPost = async (req: CustomRequest<UploadToS3Attributes>, res: Response, next: NextFunction) => {
    try {
        const { description, uploadedFiles } = req.body;

        if (!req.decodedToken) {
            throw new CustomValidationError('Unauthorized: Invalid token', 401);
        }
        if(uploadedFiles.length===0){
            throw new CustomValidationError('No files uploaded', 400);
        }
        // decodedToken tiene username y id pero solo uso id
        const { id } = req.decodedToken;

        // Crear el nuevo post en la base de datos
        const newPost = await Post.create({
            description: description,
            userId: id
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
            throw new CustomValidationError('Unauthorized: Invalid token',401);
        }

        const posts: PostWithMediaAttributes[] = await Post.findAll({
            attributes: [
                'id',
                'description',
                [
                    sequelize.literal(`(
                        SELECT CAST(COUNT(*) AS INTEGER)
                        FROM "Likes" AS likes
                        WHERE likes."postId" = "Post"."id"
                    )`), 'likesCount'
                ],
                [
                    sequelize.literal(`(
                        SELECT CAST(COUNT(*) AS INTEGER)
                        FROM "Comments" AS comments
                        WHERE comments."postId" = "Post"."id"
                    )`), 'commentsCount'
                ],
            ],
            include: [
                {
                    model: User,
                    as: 'author',
                    where: { visible: true },
                    attributes: [ 'id','username' ]
                },// Autor del post y solo trae los post de usuarios visibles
                {
                    model: PostMedia,
                    as: 'media',
                    attributes:[ 'id', 'mediaUrl', 'mediaType' ]
                },
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
            throw new CustomValidationError('Unauthorized: Invalid token',401);
        }
        const { id } = req.decodedToken;
        const posts: PostWithMediaAttributes[] = await Post.findAll({
            attributes: [
                'id',
                'description',
                [
                    sequelize.literal(`(
                        SELECT CAST(COUNT(*) AS INTEGER)
                        FROM "Likes" AS likes
                        WHERE likes."postId" = "Post"."id"
                    )`), 'likesCount'
                ],
                [
                    sequelize.literal(`(
                        SELECT CAST(COUNT(*) AS INTEGER)
                        FROM "Comments" AS comments
                        WHERE comments."postId" = "Post"."id"
                    )`), 'commentsCount'
                ],
            ],
            where: { userId: id }, // Usuario loggeado: id del usuario que viene en el token
            include: [
                { model: User, as: 'author', attributes: [ 'id', 'username' ] }, // Autor del post
                { model: PostMedia, as: 'media', attributes: [ 'id', 'mediaUrl', 'mediaType' ] },
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

interface PostFromOtherVisibleUser {
    username: string;
}

export const getAllVisiblePostsFromUser = async (req: CustomRequest<PostFromOtherVisibleUser>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){
            throw new CustomValidationError('Unauthorized: Invalid token',401);
        }
        const { username } = req.params;

        if(!username){
            throw new CustomValidationError('username is missing', 400);
        }

        if (typeof username !== 'string') {
            throw new CustomValidationError('Invalid username format',400);
        }

        const user = await User.findOne({ where: { username: username } }); // hay que validar que el username que se recibe en la query es un string o sino da overload

        if(!user){
            throw new CustomValidationError('username does not exist', 404);
        }
        if(!user.visible){
            throw new CustomValidationError('username is not public', 400);
        }
        const posts: PostWithMediaAttributes[] = await Post.findAll({
            attributes: [
                'id',
                'description',
                [
                    sequelize.literal(`(
                        SELECT CAST(COUNT(*) AS INTEGER)
                        FROM "Likes" AS likes
                        WHERE likes."postId" = "Post"."id"
                    )`), 'likesCount'
                ],
                [
                    sequelize.literal(`(
                        SELECT CAST(COUNT(*) AS INTEGER)
                        FROM "Comments" AS comments
                        WHERE comments."postId" = "Post"."id"
                    )`), 'commentsCount'
                ],
            ],
            include: [
                // Agrego el visible por si algo
                { model: User, as: 'author', where: { username: user.username, visible: true }, attributes: [ 'id', 'username' ] },
                { model: PostMedia, as: 'media' },
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