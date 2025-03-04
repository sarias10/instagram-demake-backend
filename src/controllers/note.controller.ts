import { NextFunction, Response } from 'express';

import { CustomRequest, NoteCreationAttributes } from '../types/types';
import { Note } from '../models/index';
import { CustomValidationError } from '../utils/errorFactory';

export const createNote = async (req: CustomRequest<NoteCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const { title, content, visible } = req.body;
        if (!req.decodedToken) {
            throw new CustomValidationError('Unauthorized: Token not found',401);
        }
        // decodedToken tiene username y id pero solo uso id
        // id del usuario
        const { id } = req.decodedToken;
        let newNote;
        if(visible=== undefined){
            newNote = await Note.create({
                title,
                content,
                userId: id
            });
        } else {
            newNote = await Note.create({
                title,
                content,
                visible: visible,
                userId: id
            });
        }
        res.status(201).json(newNote);
    } catch (error){
        next(error);
    }
};

export const getAllNotesByUserId = async (req: CustomRequest<NoteCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        if(!req.decodedToken){
            throw new CustomValidationError('Unauthorized: Token not found',401);
        }
        const { id } = req.decodedToken;
        const notes = await Note.findAll({
            where: {
                userId: id
            }
        });
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

export const getAllPublicNotes = async (_req: CustomRequest<NoteCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const notes = await Note.findAll({
            where: {
                visible: true,
            },
        });
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};