import { Response } from "express";

import { CustomRequest, NoteCreationAttributes } from "../types/types";
import Note from "../models/note";

export const createNote = async (req: CustomRequest<NoteCreationAttributes>, res: Response) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (error){
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown error occurred");
        }
        res.status(500).json({ error: "Failed to create note" });
    }
};

export const getAllNotes = async (_req: CustomRequest<NoteCreationAttributes>, res: Response) => {
    try {
        const notes = await Note.findAll();
        res.status(200).json(notes);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown error occurred");
        }
        res.status(500).json({ error: "Failed to retrieve notes" });
    }
};