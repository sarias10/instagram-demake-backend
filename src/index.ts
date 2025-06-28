// Inicia el servidor
import app from './app';

import { config } from './config/env';
import { checkDatabaseConnection } from './config/database';

const startServer = async (): Promise<void> => {
    try {
        await checkDatabaseConnection();
        console.log(`Environment: ${config.env}`);
        app.listen(config.port, () => {
            console.log(`🚀 Server running on http://localhost:${config.port}`);
        });
    } catch (error){
        console.log('Error initializing server:', error);
    }
};

void startServer();