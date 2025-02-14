// Archivo principal de rutas
import { Router } from "express";
//import { healthCheck } from "../controllers/health.controller";

const router = Router();

//router.get("/health", healthCheck);
router.get("/", (_req, res) => {
    res.send("Hello, World! 🌎");
});

export default router;