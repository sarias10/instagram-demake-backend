import { NextFunction, Response } from 'express';

import { CustomRequest, PostAttributes, PostCreationAttributes, PostWithMediaAttributes, UploadToS3Attributes } from '../types/types';
import { Post, PostMedia, User } from '../models/index';
import { CustomSecretValidationError, CustomValidationError } from '../utils/errorFactory';
import { config } from '../config/env';
import { sequelize } from '../config/database';
import s3 from '../utils/s3';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';

const awsCloudformationDomain = config.aws.awsCloudformationDomain;

const bucketName = config.aws.awsS3BucketPostMedia;

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

        // Traer el post con el username del autor
        const completePost: PostWithMediaAttributes | null = await Post.findOne({
            where: { id: newPost.id },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: [ 'id', 'username' ] },
                {
                    model: PostMedia,
                    as: 'media',
                    attributes: [ 'id', 'mediaUrl', 'mediaType' ],
                }
            ]
        });

        if (!completePost){
            throw new CustomSecretValidationError('complete post is null');
        }
        if (Array.isArray(completePost.media)) {
            completePost.media.forEach(media => {
                media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
            });
        }

        res.status(201).json(completePost);
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
            ],
            order: [
                [ 'id', 'desc' ]
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
            ],
            order: [
                [ 'id', 'desc' ]
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
            ],
            order: [
                [ 'id', 'desc' ]
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

export const deletePost = async (req: CustomRequest<PostAttributes>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){ // Hay que poner esto porque
            throw new CustomValidationError('Unauthorized: Invalid token',401);
        }
        const { postId } = req.params;

        const { id } = req.decodedToken; // id del usuario dueño del token

        const post = await Post.findOne({
            where: { id: postId },
            include: [
                { model:PostMedia, as: 'media', attributes: [ 'mediaUrl' ] }
            ]
        });

        // Valida que el post existe
        if(!post){
            throw new CustomValidationError('post does not exist', 400);
        }

        // Valida que el post le pertenece al usuario loggeado
        if(post.userId !== id){
            throw new CustomValidationError('post does not belong to the user logged', 400);
        }

        const postCopy: PostWithMediaAttributes = post;

        const mediaUrlArray = postCopy.media?.map(media =>  {
            return { Key: media.mediaUrl };
        });

        if (!Array.isArray(mediaUrlArray)){
            throw new CustomValidationError('does not array');
        }

        const command = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: mediaUrlArray,
            }
        });

        // Envia el comando para eliminar del s3
        await s3.send(command);

        // Elimina la información del post de la base de datos postgresql
        await post.destroy();

        res.status(204).end(); // Hay que colocar el .end() o sino se queda cargando en el postman porque no le llega un cuerpo en la respuesta
    }catch (error) {
        next(error);
    }
};