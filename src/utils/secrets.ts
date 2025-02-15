import {
    SecretsManagerClient,
    GetSecretValueCommand,
  } from "@aws-sdk/client-secrets-manager";
  
  // Definimos el tipo para los secretos
  type SecretType = Record<string, string>; // Ajusta esto según la estructura de tu secreto
  
  // Función para obtener secretos de AWS Secrets Manager con TypeScript
  export const getSecret = async (
    secretName: string,
    region: string
  ): Promise<SecretType> => {
    const client = new SecretsManagerClient({ region });
  
    try {
      // Retrieve the secret from Secrets Manager
      const response = await client.send(
        new GetSecretValueCommand({
          SecretId: secretName,
          VersionStage: "AWSCURRENT", // Default version stage
        })
      );
  
      if (!response.SecretString) {
        throw new Error(`Secret "${secretName}" does not contain a valid string`);
      }
  
      // Parse the secret string into an object (if JSON)
      return JSON.parse(response.SecretString);
    } catch (error) {
      console.error(`Error fetching secret "${secretName}":`, error);
      throw new Error("Failed to retrieve secret from AWS Secrets Manager");
    }
  };