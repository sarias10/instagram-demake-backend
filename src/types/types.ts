import { Request } from "express";

// Tipos para Notas
export interface NoteAttributes {
    id: number;
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface NoteCreationAttributes {
    title: string;
    content: string;
  }

// Tipos para Requests en Express
export interface CustomRequest<T> extends Request {
  body: T;
}