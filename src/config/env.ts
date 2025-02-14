import * as dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({ path: envFile });

// Cargar el archivo .env solo en desarrollo
// const envFile = ".env.development";
// if (process.env.NODE_ENV === "development") {
//   dotenv.config({ path: envFile });
// }

export const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    name: process.env.DB_NAME as string,
  },
};

console.log(`🛠️ Loaded environment variables from ${envFile}`);
console.log(config);