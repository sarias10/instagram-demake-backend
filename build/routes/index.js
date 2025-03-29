"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Archivo principal de rutas
const express_1 = require("express");
const protected_routes_1 = __importDefault(require("./protected.routes"));
const public_routes_1 = __importDefault(require("./public.routes"));
const middleware_1 = require("../middlewares/middleware");
const router = (0, express_1.Router)();
// Ruta de ejemplo
router.get('/', (_req, res) => {
    res.send('Sergio les dice: HOLA MUNDO! 🌎 😂');
});
// Importar rutas
router.use('/protected', middleware_1.tokenExtractor, protected_routes_1.default);
router.use('/public', public_routes_1.default);
exports.default = router;
