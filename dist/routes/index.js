"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Archivo principal de rutas
const express_1 = require("express");
//import { healthCheck } from "../controllers/health.controller";
const router = (0, express_1.Router)();
//router.get("/health", healthCheck);
router.get("/", (_req, res) => {
    res.send("Hello, World! 🌎");
});
exports.default = router;
