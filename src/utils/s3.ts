import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../config/env';

// Si NO comento AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY en .env.development
// La instancia s3, aunque el objeto 'credentials' no exista o este comentado va a
// colocar automaticamente las credenciales de AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY de .env.development

// Si comento AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY en .env.development
// La instancia de s3 va a intentar conectarse a las de aws_configure

// con este codigo se puede probar lo anterior:

// import s3 from './utils/s3';

// const main = async () => {
//     const response = await s3.config.credentials();
//     console.log(response);
// };

// void main();

const s3 = new S3Client({
    region: config.aws.region,
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
    }
});

export default s3;