import { NextFunction, Response } from 'express';

import { CustomRequest, PostAttributes, PostCreationAttributes, PostWithMediaAttributes, UploadToS3Attributes } from '../types/types';
import { Post, PostMedia, User } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';
import { config } from '../config/env';
import s3 from '../utils/s3';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import queries from '../utils/queries';

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
        const post = await queries.getPostById(id,newPost.id);

        console.log(post);
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};

export const getAllVisiblePosts = async (req: CustomRequest<PostCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){
            throw new CustomValidationError('Unauthorized: Invalid token',401);
        }

        // decodedToken tiene username y id pero solo uso id
        // id del usuario loggeado
        const { id } = req.decodedToken;

        // Consulta los posts visibles
        const posts = await queries.getVisiblePosts(id);

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

        // Consulta los posts del usuario loggeado
        const posts = await queries.getPostsFromLoggedUser(id);
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

        const { id } = req.decodedToken;
        // username del usuario del que se quiere saber los posts visibles
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

        // Consulta los posts visibles de otros usuarios
        const posts = queries.getVisiblePostsFromUser(id, username);
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