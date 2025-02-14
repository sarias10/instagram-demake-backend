"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Archivo principal de rutas
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
router.get("/health", health_controller_1.healthCheck);
router.get("/", (_req, res) => {
    res.send("Hello, World! 🌎");
});
exports.default = router;
