/*
¿Qué es una interfaz en TypeScript?
Una interfaz en TypeScript define la forma o estructura de un objeto. Es un contrato que establece qué propiedades y tipos deben estar presentes en un objeto, pero no proporciona una implementación concreta. Las interfaces ayudan a verificar el tipo en tiempo de compilación, mejorando la seguridad y legibilidad del código.

Por ejemplo, esta interfaz:

interface User {
  id: number;
  name: string;
}

indica que cualquier objeto del tipo User debe tener:

id de tipo number
name de tipo string
Si intentas crear un objeto sin cumplir con esta estructura, TypeScript marcará un error.
*/

import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
// Tipos para PostMedia
export interface PostMediaAttributes {
    id: number; // Identificador único
    postId: number; // Relación con el post
    mediaUrl: string; // URL del archivo en S3
    mediaType: 'image' | 'video'; // Tupo de archivo
    createdAt?: Date;
    updatedAt?: Date;
}

export type PostMediaCreationAttributes = Omit<PostMediaAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export interface UploadToS3Attributes {
    description: string,
    uploadedFiles: {
        mediaUrl: string,
        mediaType: 'image' | 'video',
    }[];  // Ahora acepta archivos subidos opcionalmente
}
// Tipos para Posts
export interface PostAttributes {
    id: number; //Identificador único del post (entero)
    description: string; // Descricion del post (texto)
    userId: number; // Identificador del usuario que creó la nota (entero)
    createdAt?: Date; // Fecha de creación (opcional, tipo Date)
    updatedAt?: Date; // Fecha de última actualización (opcional, tipo Date)
}

export type PostCreationAttributes = Omit<PostAttributes, 'id' | 'createdAt' | 'updatedAt'> & {
    uploadedFiles?: PostMediaCreationAttributes[];  // Ahora acepta archivos subidos opcionalmente
};

// Tipos para Usuarios
export interface UserAttributes {
    id: number;
    username: string;
    name: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserCreationAttributes = Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

//Tipos para Likes
export interface LikeAttributes {
    id: number;
    userId: number;
    postId?: number;
    commentId?: number;
    createdAt?: Date; // Fecha de creación (opcional, tipo Date)
    updatedAt?: Date; // Fecha de última actualización (opcional, tipo Date)
}

export type LikeCreationAttributes = Omit<LikeAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// Tipos para comentarios
export interface CommentAttributes {
    id: number; // Identificador único del comentario
    content: string; // Contenido del comentario
    userId: number; // ID del usuario que creó el comentario
    postId: number; // ID de la nota a la que pertenece el comentario
    createdAt?: Date; // Fecha de creación (opcional, definida automáticamente)
    updatedAt?: Date; // Fecha de última actualización (opcional, definida automáticamente)
}

export type CommentCreationAttributes = Omit<CommentAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export interface DecodedToken {
    username: string;
    id: number;
}

// Tipos para Requests en Express
export interface CustomRequest<T> extends Request {
    body: T;
    decodedToken?: DecodedToken;
}

// Tipo para Request de token

export interface CustomTokenRequest extends Request{
    decodedToken: string | JwtPayload;
};
