"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.loadConfig = void 0;
const dotenv = __importStar(require("dotenv"));
const secrets_1 = require("../utils/secrets");
// Determinar si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';
// Cargar variables de entorno en desarrollo
if (!isProduction) {
    dotenv.config({ path: '.env.development' });
    console.log('🛠️ Loaded environment variables from .env.development');
}
// Configuración inicial vacía
let config;
const loadConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    let secrets = {};
    if (isProduction) {
        secrets = yield (0, secrets_1.getSecret)('sm-aws-backend-dev', 'us-east-2');
        Object.assign(process.env, secrets);
        console.log('🔐 AWS Secrets loaded successfully');
    }
    exports.config = config = {
        port: process.env.PORT || 3000,
        secret: process.env.JWT_SECRET,
        db: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            name: process.env.DB_NAME,
        },
        aws: {
            region: process.env.AWS_DEFAULT_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            awsS3BucketPostMedia: process.env.AWS_S3_BUCKET_POST_MEDIA,
            awsCloudformationDomain: process.env.AWS_CLOUDFORMATION_DOMAIN,
        },
        environment: process.env.ENVIRONMENT || 'development',
    };
});
exports.loadConfig = loadConfig;
