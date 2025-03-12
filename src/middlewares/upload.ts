import multer, { StorageEngine } from 'multer';
import { Response, NextFunction } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../utils/s3';
import { config } from '../config/env';
import { CustomValidationError } from '../utils/errorFactory';
import { CustomRequest, UploadToS3Attributes } from '../types/types';

// Nombre del bucket desde la configuración
const bucketName = config.aws.awsS3BucketPostMedia;

// Configuración de multer para guardar archivos en memoria temporalmente
const storage: StorageEngine = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para recibir múltiples archivos desde el formulario
// primer argumento: media es el nombre de la key donde se subiran los archivos en body -> form-data
// segundo argumento: el segundo archivo es cuantos archivos maximos se pueden subir
export const uploadMiddleware = upload.array('media', 10);

// Middleware para subir archivos a S3
export const uploadToS3 = async (req: CustomRequest<UploadToS3Attributes>, _res: Response, next: NextFunction) => {
    try{
        if (!req.decodedToken) {
            throw new CustomValidationError('Unauthorized: Token not found', 401);
        }
        if (!req.files || !(req.files instanceof Array)) {
            throw new CustomValidationError('No files uploaded', 400);
        }

        const userId = req.decodedToken.id;
        const files = req.files;

        const uploadedFiles = await Promise.all(files.map(async (file) => {
            console.log('file type:', file.mimetype);
            console.log('starts with', file.mimetype.startsWith('image'));
            if(!file.mimetype.startsWith('image') && !file.mimetype.startsWith('video')){ // Valida que el archivo sea una imagen o un video
                throw new CustomValidationError('files are not image or video', 400);
            }
            const typeOfFile: 'image' | 'video' = file.mimetype.startsWith('image')? 'image': 'video';
            const folder = file.mimetype.startsWith('image') ? 'images' : 'videos';
            const fileName = `user-${userId}/${folder}/${Date.now()}`;

            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
                //ACL: 'public-read',
                ContentType: file.mimetype,
            });

            await s3.send(command);

            return { mediaUrl: fileName, mediaType: typeOfFile };
        }));

        req.body.uploadedFiles = uploadedFiles;

        next();
    } catch(error){
        next(error);
    }
};