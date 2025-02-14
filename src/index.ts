// Inicia el servidor
import app from "./app";
import { config } from "./config/env";
//import { checkDatabaseConnection } from "./config/database";

const startServer = () => {
  //await checkDatabaseConnection();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
};

void startServer();