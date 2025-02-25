import { NextFunction, Response } from 'express';

import { CustomRequest, NoteCreationAttributes } from '../types/types';
import { Note } from '../models/index';

export const createNote = async (req: CustomRequest<NoteCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (error){
        next(error);
    }
};

export const getAllNotes = async (_req: CustomRequest<NoteCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const notes = await Note.findAll();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};