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

// Tipos para Notas
export interface NoteAttributes {
    id: number; //Identificador único de la nota (entero)
    title: string; // Título de la nota (texto)
    content: string; // Contenido de la nota (texto)
    visible: boolean; // Indica si la nota es visible (true o false)
    userId: number; // Identificador del usuario que creó la nota (entero)
    createdAt?: Date; // Fecha de creación (opcional, tipo Date)
    updatedAt?: Date; // Fecha de última actualización (opcional, tipo Date)
}

export type NoteCreationAttributes = Omit<NoteAttributes, 'id' | 'createdAt' | 'updatedAt'>;

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
  noteId?: number;
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
  noteId?: number; // ID de la nota a la que pertenece el comentario (null si es un comentario a otro comentario)
  createdAt?: Date; // Fecha de creación (opcional, definida automáticamente)
  updatedAt?: Date; // Fecha de última actualización (opcional, definida automáticamente)
}

export type CommentCreationAttributes = Omit<CommentAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// Tipos para Requests en Express
export interface CustomRequest<T> extends Request {
  body: T;
}