"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Inicia el servidor
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
//import { checkDatabaseConnection } from "./config/database";
const startServer = () => {
    //await checkDatabaseConnection();
    app_1.default.listen(env_1.config.port, () => {
        console.log(`🚀 Server running on http://localhost:${env_1.config.port}`);
    });
};
void startServer();
