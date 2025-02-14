// Archivo principal de rutas
import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";
import { createNote } from "../controllers/note.controller";

const router = Router();

router.get("/health", healthCheck);
router.get("/", (_req, res) => {
    res.send("Sergio 2000 les dice: HOLA MUNDO! 🌎 😂");
});
router.post("/notes", createNote);

export default router;