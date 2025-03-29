"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Configura Express
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const middleware_1 = require("./middlewares/middleware");
// Creamos una nueva instancia de una aplicación Express. `app` es un objeto que tiene métodos para rutas y middleware, entre otras cosas.
const app = (0, express_1.default)();
// Middlewares
// Este middleware analiza los cuerpos de las solicitudes entrantes en un formato JSON, lo que significa que podemos acceder al cuerpo de la solicitud como un objeto JavaScript en nuestros controladores de rutas.
app.use(express_1.default.json());
app.use(middleware_1.requestLogger);
// Este middleware por defecto permite solicitudes de todos los orígenes
app.use((0, cors_1.default)());
// Rutas
app.use('/api', index_1.default);
// Maneja las solicitudes con endpoints desconocidos
app.use(middleware_1.unknownEndpoint);
// Maneja todos los errores, por eso se ejecuta de último
app.use(middleware_1.errorHandler);
exports.default = app;
